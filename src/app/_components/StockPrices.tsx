"use client";
import React, { useState, useEffect, useRef } from 'react';
import { api } from '~/trpc/react';

interface EODData {
  ticker: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

const StockPrices = ({ setInvestments }: { setInvestments: (investments: string) => void }) => {
  const [eodData, setEODData] = useState<EODData[] | null>(null); // Handle array of EOD data
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const hasFetchedRef = useRef(false); // Ref to track if fetch has been called

  const { mutate: getLatestEODData, isLoading } = api.polygon.getLatestEODData.useMutation({
    onSuccess: (data) => {
      console.log('Received EOD data:', data);
      setEODData(data.eodData); // Assuming eodData is an array

      // Create a string of tickers for querying Gemini
      const tickers = data.eodData.map((entry: EODData) => entry.ticker).join(', ');
      setInvestments(tickers); // Pass the tickers to the parent component

      setErrorMessage(null);
    },
    onError: (error) => {
      console.error('Error fetching EOD data:', error);
      setErrorMessage(error.message);
      setEODData(null);
    },
  });

  // Function to fetch EOD data
  const fetchEODData = () => {
    if (!hasFetchedRef.current) {
      console.log('Fetching EOD data');
      getLatestEODData();
      hasFetchedRef.current = true; // Prevent future fetches
    }
  };

  // Fetch EOD data on component mount
  useEffect(() => {
    fetchEODData();
  }, []);

  return (
    <div className="p-5 bg-[#292464] rounded-lg">
      <h2 className="text-2xl font-bold mb-4">End of Day Stock Data</h2>

      {isLoading ? (
        <p>Loading...</p>
      ) : eodData ? (
        <div>
          <table className="w-full text-left table-auto mb-6">
            <thead>
              <tr>
                <th className="px-4 py-2">Ticker</th> {/* Change column header to Ticker */}
                <th className="px-4 py-2">Open</th>
                <th className="px-4 py-2">High</th>
                <th className="px-4 py-2">Low</th>
                <th className="px-4 py-2">Close</th>
                <th className="px-4 py-2">Volume</th>
              </tr>
            </thead>
            <tbody>
              {eodData.map((data, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{data.ticker}</td>
                  <td className="border px-4 py-2">{data.open}</td>
                  <td className="border px-4 py-2">{data.high}</td>
                  <td className="border px-4 py-2">{data.low}</td>
                  <td className="border px-4 py-2">{data.close}</td>
                  <td className="border px-4 py-2">{data.volume}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No EOD data available.</p>
      )}
    </div>
  );
};

export default StockPrices;
