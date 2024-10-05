"use client";
import { useState, useEffect } from 'react';
import { api } from '~/trpc/react';

const PlaidLink = () => {
  const [clientUserId] = useState('your-client-user-id'); // Replace this with your actual user ID
  const { mutate: createLinkToken, data, error } = api.plaid.createLinkToken.useMutation();

  const handleCreateLinkToken = () => {
    createLinkToken({
      clientUserId, // Pass the user ID when calling the mutation
    });
  };

  // Use useEffect to watch for data changes and log the link_token
  useEffect(() => {
    if (data?.link_token) {
      console.log("Link Token:", data.link_token); // Log only the link_token
    }
  }, [data]); // This effect runs whenever `data` changes

  return (
    <div>
      <button onClick={handleCreateLinkToken}>
        Create Link Token
      </button>

      {error && <p>Error: {error.message}</p>} {/* Display error if it occurs */}
    </div>
  );
};

export default PlaidLink;
