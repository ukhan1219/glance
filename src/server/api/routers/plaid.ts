import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';

// Configure the Plaid client
const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID || '',
      'PLAID-SECRET': process.env.PLAID_SECRET || '',
    },
  },
});

const plaidClient = new PlaidApi(configuration);

// Define the tRPC router for Plaid operations
export const plaidRouter = createTRPCRouter({
  createLinkToken: publicProcedure
    .input(z.object({ clientUserId: z.string() }))
    .mutation(async ({ input }) => {
      const { clientUserId } = input;

      const request = {
        user: { //cliendUserId
          client_user_id: 'user',
        },
        client_name: 'Plaid Test App',
        products: ['auth'],
        language: 'en',
        redirect_uri: 'http://localhost:3000/',
        country_codes: ['US'],
      };

      try {
        const createTokenResponse = await plaidClient.linkTokenCreate(request);
        return { link_token: createTokenResponse.data.link_token }; // Return the link_token
      } catch (error) {
        throw new Error('Failed to create link token');
      }
    }),
});
