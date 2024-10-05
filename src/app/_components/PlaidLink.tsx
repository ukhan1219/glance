
"use client";
import { useState, useEffect } from "react";
import { usePlaidLink } from "react-plaid-link";
import { api } from '~/trpc/react';

function PlaidAuthentication({ publicToken, setBalance }: { publicToken: string, setBalance: (balance: string) => void }) {
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
            const endDate = new Date().toISOString().split('T')[0]; // Today's date
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - 30); // 30 days ago
            const startDateString = startDate.toISOString().split('T')[0];

            getTransactions({
                accessToken,
                startDate: startDateString,
                endDate,
            });
        }
    }, [dataPub, getAccountBalance, getTransactions]);

    useEffect(() => {
        if (dataTransactions) {
            const { transactions } = dataTransactions;

            // Handle the transactions (e.g., display or store them)
            console.log('Transactions:', transactions);
        }
    }, [dataTransactions]);

    useEffect(() => {
        if (dataBalance?.accounts) {
            const totalBalance = dataBalance.accounts
                .map((account: any) => account.balances.available)
                .reduce((acc: number, balance: number) => acc + balance, 0);
            setBalance(totalBalance.toFixed(2)); // Set total balance in the parent
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

const PlaidLink = ({ onOpen, onSuccess, setBalance }: { onOpen: (openPlaid: () => void, ready: boolean) => void, onSuccess: (token: string) => void, setBalance: (balance: string) => void }) => {
    const [clientUserId] = useState('your-client-user-id'); // Replace this with your actual user ID
    const [linkToken, setLinkToken] = useState<string | undefined>(undefined);
    const [publicToken, setPublicToken] = useState<string | undefined>(undefined);
    const { mutate: createLinkToken, data, error } = api.plaid.createLinkToken.useMutation();

    // Automatically generate the link token when the component mounts
    useEffect(() => {
        createLinkToken({
            clientUserId,
        });
    }, [clientUserId, createLinkToken]);

    // Fetch link token when mutation completes
    useEffect(() => {
        if (data?.link_token) {
            setLinkToken(data.link_token);
            console.log("link token:", data.link_token);
        }
    }, [data]);

    const { open, ready } = usePlaidLink({
        token: linkToken || '',
        onSuccess: (public_token, metadata) => {
            setPublicToken(public_token);
            onSuccess(public_token); // Notify the parent of the successful authentication
        },
    });

    // Pass the open function and ready status to the parent component
    useEffect(() => {
        if (onOpen && ready) {
            onOpen(open, ready);
        }
    }, [onOpen, open, ready]);

    return publicToken ? (
        <PlaidAuthentication publicToken={publicToken} setBalance={setBalance} />
    ) : (
        <div>
            {/* <button onClick={() => open()} disabled={!ready || !linkToken}>
                Connect a bank account
            </button> */}
            {error && <p>Error: {error.message}</p>}
        </div>
    );
};

export default PlaidLink;
