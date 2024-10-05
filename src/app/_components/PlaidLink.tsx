"use client";
import { useState, useEffect } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { api } from '~/trpc/react';

function PlaidAuthentication({ publicToken }: { publicToken: string }) {
    const { mutate: exchangePublicToken, data: dataPub, error: errorPub } = api.plaid.exchangePublicToken.useMutation();
    const { mutate: getAccountBalance, data: dataBalance, error: errorBalance } = api.plaid.getAccountBalance.useMutation();

    useEffect(() => {
        async function fetchData() {
            exchangePublicToken({
                publicToken,
            });
        }
        fetchData();
    }, [publicToken, exchangePublicToken]);

    // Trigger account balance fetching once access token is available
    useEffect(() => {
        if (dataPub?.access_token) {
            console.log("Access Token:", dataPub.access_token);
            console.log("Item ID:", dataPub.item_id);
            
            getAccountBalance({
                accessToken: dataPub.access_token,  // Fetch the account balance using the access token
            });
        }
    }, [dataPub, getAccountBalance]);

    // Log account balances
    useEffect(() => {
        if (dataBalance?.accounts) {
            console.log("Account Balances:", dataBalance.accounts);
        }
    }, [dataBalance]);

    return (
        <div>
            <span>Public Token: {publicToken}</span>
            {dataBalance && dataBalance.accounts && (
                <div>
                    <h3>Account Balances</h3>
                    <ul>
                        {dataBalance.accounts.map((account: any) => (
                            <li key={account.account_id}>
                                {account.name}: ${account.balances.available}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {errorPub && <p>Error exchanging public token: {errorPub.message}</p>}
            {errorBalance && <p>Error fetching account balance: {errorBalance.message}</p>}
        </div>
    );
}

const PlaidLink = () => {
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
            console.log('Public Token:', public_token);
            console.log('Metadata:', metadata);
        },
    });

    return publicToken ? (
        <PlaidAuthentication publicToken={publicToken} />
    ) : (
        <div>
            <button onClick={() => open()} disabled={!ready || !linkToken}>
                Connect a bank account
            </button>
            {error && <p>Error: {error.message}</p>}
        </div>
    );
};

export default PlaidLink;
