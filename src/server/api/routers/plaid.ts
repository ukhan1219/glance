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
        user: { // TODO: clientUserId (make it dynamic)
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
        // return { link_token: createTokenResponse.data.link_token }; // Return the link_token
        return createTokenResponse.data;
      } catch (error) {
        throw new Error('Failed to create link token');
      }
    }),
    exchangePublicToken: publicProcedure
    .input(z.object({ publicToken: z.string(), }))
    .mutation(async  ({ input }) => {
        const  { publicToken } = input;


        try {
            const response = await plaidClient.itemPublicTokenExchange({public_token: publicToken,});

            const {access_token, item_id} = response.data;

            // await db.saveAccessToken(userId, access_token);

            return {
                public_token_exchange: 'complete',
                access_token,
                item_id,
            };
        } catch (error) {
            throw  new Error('Failed to exchange public token');
        }
    }),

    getAccountBalance: publicProcedure
    .input(z.object({ accessToken: z.string() }))  // Input is the access token
    .mutation(async ({ input }) => {
      const { accessToken } = input;

      try {
        const request = {
          access_token: accessToken,
        };
        const response = await plaidClient.accountsBalanceGet(request);

        const { accounts } = response.data;

        return { accounts };  // Return the account balances
      } catch (error) {
        throw new Error('Failed to get account balance');
      }
    }),

});
