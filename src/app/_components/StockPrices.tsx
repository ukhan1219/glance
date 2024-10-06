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
  const [eodData, setEODData] = useState<EODData[] | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const hasFetchedRef = useRef(false);

  const { mutate: getLatestEODData, isLoading } = api.polygon.getLatestEODData.useMutation({
    onSuccess: (data) => {
      setEODData(data.eodData);
      const tickers = data.eodData.map((entry: EODData) => entry.ticker).join(', ');
      setInvestments(tickers);
      setErrorMessage(null);
    },
    onError: (error) => {
      setErrorMessage(error.message);
      setEODData(null);
    },
  });

  useEffect(() => {
    if (!hasFetchedRef.current) {
      getLatestEODData();
      hasFetchedRef.current = true;
    }
  }, []);

  return (
    <div className="p-5 bg-[#292464] rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-white">Watch List</h2>

      {isLoading ? (
        <p className="text-white">Loading...</p>
      ) : eodData ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left table-auto neumorphic-table">
            <thead>
              <tr className="text-white">
                <th className="px-6 py-3">Ticker</th>
                <th className="px-6 py-3">Open</th>
                <th className="px-6 py-3">High</th>
                <th className="px-6 py-3">Low</th>
                <th className="px-6 py-3">Close</th>
                <th className="px-6 py-3">Volume</th>
              </tr>
            </thead>
            <tbody>
              {eodData.map((data, index) => (
                <tr key={index} className="text-gray-300">
                  <td className="px-6 py-4">{data.ticker}</td>
                  <td className="px-6 py-4">{data.open}</td>
                  <td className="px-6 py-4">{data.high}</td>
                  <td className="px-6 py-4">{data.low}</td>
                  <td className="px-6 py-4">{data.close}</td>
                  <td className="px-6 py-4">{data.volume}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-white">No EOD data available.</p>
      )}
    </div>
  );
};

export default StockPrices;
