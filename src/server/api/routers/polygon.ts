import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import axios from 'axios';
import { getLastMarketDay } from './getLastMarketDay'; // Use your utility for last market day

// Polygon.io API key from environment variables
const apiKey = process.env.POLYGON_API_KEY || '';

// Define the fixed array of tickers
const FIXED_TICKERS = ['$AAPL', '$TSLA', '$NVDA', '$BK', '$SPY'];

// Define the tRPC router for Polygon operations
export const polygonRouter = createTRPCRouter({
  getLatestEODData: publicProcedure.mutation(async () => {
    // Function to sanitize tickers (remove '$' if present)
    const sanitizeTicker = (ticker: string) => ticker.replace(/^\$/, '');

    // Prepare sanitized tickers
    const sanitizedTickers = FIXED_TICKERS.map(sanitizeTicker);

    // Function to fetch EOD data for a single ticker
    const fetchEODForTicker = async (ticker: string) => {
      try {
        // Ensure you are using the last valid market day instead of yesterday
        const from = getLastMarketDay();
        const to = getLastMarketDay();

        const response = await axios.get(
          `https://api.polygon.io/v2/aggs/ticker/${encodeURIComponent(
            ticker
          )}/range/1/day/${from}/${to}`,
          {
            params: {
              apiKey,
            },
          }
        );

        // Log the entire API response for better debugging
        console.log(`API response for ticker ${ticker}:`, response.data);

        const results = response.data.results;

        // Handle cases where no results are found
        if (!results || results.length === 0) {
          console.warn(`No EOD data found for ticker: ${ticker}`);
          return null; // Return null instead of throwing an error
        }

        const eodData = results.map((entry: any) => ({
          ticker,
          date: new Date(entry.t).toISOString().split('T')[0],
          open: entry.o,
          high: entry.h,
          low: entry.l,
          close: entry.c,
          volume: entry.v,
        }));

        return eodData[0]; // Assuming one entry per day
      } catch (error: any) {
        if (axios.isAxiosError(error)) {
          console.error(`Axios Error for ticker ${ticker}:`, error.message);
          if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
          }
        } else {
          console.error(`Unexpected Error for ticker ${ticker}:`, error);
        }
        return null; // Return null instead of throwing an error
      }
    };

    try {
      // Fetch EOD data for all fixed tickers in parallel
      const promises = sanitizedTickers.map((ticker) => fetchEODForTicker(ticker));
      const eodDataArray = (await Promise.all(promises)).filter((data) => data !== null); // Filter out null values

      // Log the EOD data array
      console.log('EOD Data Array:', eodDataArray);

      return { eodData: eodDataArray };
    } catch (error: any) {
      console.error('Error fetching EOD data:', error);
      throw new Error('Failed to fetch EOD data');
    }
  }),
});

