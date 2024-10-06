import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { Configuration, PlaidApi, PlaidEnvironments, CountryCode, Products} from 'plaid';

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
  createLinkToken: protectedProcedure
    .input(z.object({ clientUserId: z.string() }))
    .mutation(async ({ input }) => {
      const { clientUserId } = input;

      const request = {
        user: {
          client_user_id: clientUserId,
        },
        client_name: 'Plaid Test App',
        products: [Products.Auth, Products.Transactions], // Include 'transactions' here
        language: 'en',
        redirect_uri: 'http://localhost:3000/',
        country_codes: [CountryCode.Us],
      };

      try {
        const createTokenResponse = await plaidClient.linkTokenCreate(request);
        return createTokenResponse.data;
      } catch (error) {
        console.error('Error creating link token:', error);
        throw new Error('Failed to create link token');
      }
    }),
  exchangePublicToken: protectedProcedure
    .input(z.object({ publicToken: z.string(), }))
    .mutation(async ({ input }) => {
      const { publicToken } = input;


      try {
        const response = await plaidClient.itemPublicTokenExchange({ public_token: publicToken, });

        const { access_token, item_id } = response.data;

        // await db.saveAccessToken(userId, access_token);

        return {
          public_token_exchange: 'complete',
          access_token,
          item_id,
        };
      } catch (error) {
        throw new Error('Failed to exchange public token');
      }
    }),

  getAccountBalance: protectedProcedure
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

  syncTransactions: protectedProcedure
    .input(
      z.object({
        accessToken: z.string(),
        cursor: z.string().optional(), // Optional cursor for pagination
      })
    )
    .mutation(async ({ input }) => {
      const { accessToken, cursor } = input;

      let added: Array<any> = [];
      let modified: Array<any> = [];
      let removed: Array<any> = [];
      let hasMore = true;
      let newCursor = cursor;

      try {
        while (hasMore) {
          const request = {
            access_token: accessToken,
            cursor: newCursor,
          };
          const response = await plaidClient.transactionsSync(request);
          const data = response.data;

          // Concatenate new data
          added = added.concat(data.added);
          modified = modified.concat(data.modified);
          removed = removed.concat(data.removed);

          // Update cursor and hasMore flag
          newCursor = data.next_cursor;
          hasMore = data.has_more;
        }

        // Return the transactions and the new cursor
        return {
          added,
          modified,
          removed,
          cursor: newCursor,
        };
      } catch (error) {
        throw new Error('Failed to sync transactions');
      }
    }),

  getTransactions: protectedProcedure
    .input(
      z.object({
        accessToken: z.string(),
        startDate: z.string(), // ISO 8601 date string
        endDate: z.string(),   // ISO 8601 date string
      })
    )
    .mutation(async ({ input }) => {
      const { accessToken, startDate, endDate } = input;

      try {
        const request = {
          access_token: accessToken,
          start_date: startDate,
          end_date: endDate,
        };
        const response = await plaidClient.transactionsGet(request);
        const data = response.data;

        // Return the transactions and other relevant data
        return {
          accounts: data.accounts,
          transactions: data.transactions,
          total_transactions: data.total_transactions,
        };
      } catch (error: any) {  // Casting error to 'any'
        console.error('Error getting transactions:', error.response?.data || error);
        throw new Error('Failed to get transactions: ' + (error.response?.data?.error_message || error.message));
      }
    }),
});


// getTransactions: protectedProcedure