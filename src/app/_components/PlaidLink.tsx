"use client";

import { useState, useEffect } from "react";
import { usePlaidLink } from "react-plaid-link";
import { api } from '~/trpc/react';
import { Transaction } from './types';

interface PlaidAuthenticationProps {
  publicToken: string;
  setBalance: (balance: string) => void;
  setTransactions: (transactions: Transaction[]) => void; // Use Transaction[] for transactions
}

function PlaidAuthentication({ publicToken, setBalance, setTransactions }: PlaidAuthenticationProps) {
  const { mutate: exchangePublicToken, data: dataPub, error: errorPub } = api.plaid.exchangePublicToken.useMutation();
  const { mutate: getAccountBalance, data: dataBalance, error: errorBalance } = api.plaid.getAccountBalance.useMutation();
  const { mutate: getTransactions, data: dataTransactions, error: errorTransactions } = api.plaid.getTransactions.useMutation();

  
  useEffect(() => {
    async function fetchData() {
      exchangePublicToken({ publicToken });
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

      getTransactions({ accessToken, startDate: startDateString, endDate });
    }
  }, [dataPub, getAccountBalance, getTransactions]);

  useEffect(() => {
    if (dataTransactions) {
      const { transactions } = dataTransactions;
      console.log('Transactions:', transactions);
      // Format the transactions to match the Transaction interface
      const formattedTransactions: Transaction[] = transactions.map((txn: any) => ({
        amount: txn.amount,
        category: txn.category,
        date: txn.date,
        merchantName: txn.merchant_name,
      }));

      setTransactions(formattedTransactions); // Pass formatted transactions
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

interface PlaidLinkProps {
  onOpen: (openPlaid: () => void, ready: boolean) => void;
  onSuccess: (token: string) => void;
  setBalance: (balance: string) => void;
  setTransactions: (transactions: Transaction[]) => void; // Use Transaction[] for transactions
}

const PlaidLink = ({ onOpen, onSuccess, setBalance, setTransactions }: PlaidLinkProps) => {
  const [clientUserId] = useState("your-client-user-id"); 
  const [linkToken, setLinkToken] = useState<string | undefined>(undefined);
  const [publicToken, setPublicToken] = useState<string | undefined>(undefined);
  const { mutate: createLinkToken, data, error } = api.plaid.createLinkToken.useMutation();

  useEffect(() => {
    createLinkToken({ clientUserId });
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
