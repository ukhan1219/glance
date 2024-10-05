
import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import axios from 'axios';

// Polygon.io API key from environment variables
const apiKey = process.env.POLYGON_API_KEY || '';

// Define the fixed array of tickers
const FIXED_TICKERS = ['$AAPL', '$TSLA', '$NVDA', '$BK', '$SPY'];

// Define the tRPC router for Polygon operations
export const polygonRouter = createTRPCRouter({
  getLatestEODData: publicProcedure
    .mutation(async () => {
      // Function to sanitize tickers (remove '$' if present)
      const sanitizeTicker = (ticker: string) => ticker.replace(/^\$/, '');

      // Prepare sanitized tickers
      const sanitizedTickers = FIXED_TICKERS.map(sanitizeTicker);

      // Function to fetch EOD data for a single ticker
      const fetchEODForTicker = async (ticker: string) => {
        try {
          const today = new Date();
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);

          const from = yesterday.toISOString().split('T')[0]; // YYYY-MM-DD
          const to = yesterday.toISOString().split('T')[0]; // YYYY-MM-DD

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

          const results = response.data.results;

          if (!results || results.length === 0) {
            throw new Error(`No EOD data found for ticker: ${ticker}`);
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
          throw new Error(`Failed to fetch EOD data for ticker: ${ticker}`);
        }
      };

      try {
        // Fetch EOD data for all fixed tickers in parallel
        const promises = sanitizedTickers.map((ticker) => fetchEODForTicker(ticker));
        const eodDataArray = await Promise.all(promises);

        return { eodData: eodDataArray };
      } catch (error: any) {
        console.error('Error fetching EOD data:', error);
        throw new Error('Failed to fetch EOD data');
      }
    }),
});


// utils/getLastMarketDay.ts

export const getLastMarketDay = (): string => {
    const today = new Date();
    let lastDay = new Date(today);
    lastDay.setDate(today.getDate() - 1); // Start with yesterday
  
    // Loop to skip weekends
    while (lastDay.getDay() === 0 || lastDay.getDay() === 6) { // Sunday=0, Saturday=6
      lastDay.setDate(lastDay.getDate() - 1);
    }
  
    // Format to YYYY-MM-DD
    return lastDay.toISOString().split('T')[0];
  };
  
