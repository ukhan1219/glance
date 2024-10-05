"use client";
import { useState, useEffect } from "react";
import { usePlaidLink } from "react-plaid-link";
import { api } from '~/trpc/react';

function PlaidAuthentication({
  publicToken,
  setBalance,
  setTransactions, // Ensure this is correctly passed
}: {
  publicToken: string;
  setBalance: (balance: string) => void;
  setTransactions: (transactions: any[]) => void; // Ensure this is in the prop types
}) {
  const { mutate: exchangePublicToken, data: dataPub, error: errorPub } = api.plaid.exchangePublicToken.useMutation();
  const { mutate: getAccountBalance, data: dataBalance, error: errorBalance } = api.plaid.getAccountBalance.useMutation();
  const { mutate: getTransactions, data: dataTransactions, error: errorTransactions } = api.plaid.getTransactions.useMutation();

  useEffect(() => {
      async function fetchData() {
          exchangePublicToken({
              publicToken,
          });
      }
      fetchData();
  }, [publicToken, exchangePublicToken]);

  useEffect(() => {
      if (dataPub?.access_token) {
          const accessToken = dataPub.access_token;

          // Fetch account balance
          getAccountBalance({ accessToken });

          // Fetch transactions
          const endDate = new Date().toISOString().split("T")[0]; // Today's date
          const startDate = new Date();
          startDate.setDate(startDate.getDate() - 30); // 30 days ago
          const startDateString = startDate.toISOString().split("T")[0];

          getTransactions({
            accessToken,
            startDate: startDateString ?? '',  // Ensure it's a string
            endDate: endDate ?? '',  // Ensure it's a string
          });
      }
  }, [dataPub, getAccountBalance, getTransactions]);

  useEffect(() => {
      if (dataTransactions) {
          const { transactions } = dataTransactions;
          setTransactions(transactions); // Make sure this function is called
      }
  }, [dataTransactions, setTransactions]);

  useEffect(() => {
      if (dataBalance?.accounts) {
          const totalBalance = dataBalance.accounts
              .map((account: any) => account.balances.available)
              .reduce((acc: number, balance: number) => acc + balance, 0);
          setBalance(totalBalance.toFixed(2));
      }
  }, [dataBalance, setBalance]);

  return (
      <div>
          {errorPub && <p>Error exchanging public token: {errorPub.message}</p>}
          {errorBalance && <p>Error fetching account balance: {errorBalance.message}</p>}
          {errorTransactions && <p>Error getting transactions: {errorTransactions.message}</p>}
      </div>
  );
}


const PlaidLink = ({
  onOpen,
  onSuccess,
  setBalance,
  setTransactions, // Ensure this is in the props
}: {
  onOpen: (openPlaid: () => void, ready: boolean) => void;
  onSuccess: (token: string) => void;
  setBalance: (balance: string) => void;
  setTransactions: (transactions: any[]) => void; // Add this to the props
}) => {
  const [clientUserId] = useState("your-client-user-id"); 
  const [linkToken, setLinkToken] = useState<string | undefined>(undefined);
  const [publicToken, setPublicToken] = useState<string | undefined>(undefined);
  const { mutate: createLinkToken, data, error } = api.plaid.createLinkToken.useMutation();

  useEffect(() => {
    createLinkToken({
      clientUserId,
    });
  }, [clientUserId, createLinkToken]);

  useEffect(() => {
    if (data?.link_token) {
      setLinkToken(data.link_token);
    }
  }, [data]);

  const { open, ready } = usePlaidLink({
    token: linkToken || "",
    onSuccess: (public_token) => {
      setPublicToken(public_token);
      onSuccess(public_token);
    },
  });

  useEffect(() => {
    if (onOpen && ready) {
        onOpen(open as () => void, ready);
      }
  }, [onOpen, open, ready]);

  return publicToken ? (
    <PlaidAuthentication
      publicToken={publicToken}
      setBalance={setBalance}
      setTransactions={setTransactions} // Ensure it's passed here
    />
  ) : (
    <div>{error && <p>Error: {error.message}</p>}</div>
  );

};

export default PlaidLink;

