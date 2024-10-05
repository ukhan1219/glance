"use client";
import React, { useState, useEffect, useRef } from 'react';
import { api } from '~/trpc/react';

interface EODData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

const StockPrices = () => {
  const [ticker, setTicker] = useState('AAPL'); // Default ticker
  const [eodData, setEODData] = useState<EODData[] | null>(null);  // Updated to handle array of EODData
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  const hasFetchedRef = useRef(false); // Ref to track if fetch has been called

  const { mutate: getLatestEODData } = api.polygon.getLatestEODData.useMutation({
    onSuccess: (data) => {
      console.log('Received EOD data:', data, ticker);
      setEODData(data.eodData);  // Assuming eodData is an array
      setErrorMessage(null);
      setIsLoading(false); // Reset loading state
    },
    onError: (error) => {
      console.error('Error fetching EOD data:', error);
      setErrorMessage(error.message);
      setEODData(null);
      setIsLoading(false); // Reset loading state
    },
  });

  // Function to fetch EOD data
  const fetchEODData = () => {
    if (!hasFetchedRef.current) {
      setIsLoading(true); // Set loading state before fetching
      console.log('Fetching EOD data for ticker:', ticker);
      getLatestEODData();  // Ensure that the backend expects this input, or remove it if not needed
      hasFetchedRef.current = true; // Prevent future fetches
    }
  };

  // Fetch EOD data on component mount
  useEffect(() => {
    fetchEODData();
  }, []);


  return (
    <div></div>
    // <div className="p-5 bg-[#292464] rounded-lg">
    //   <h2 className="text-2xl font-bold mb-4">End of Day Stock Data</h2>

    //   {/* Display EOD Data */}
    //   {eodData ? (
    //     <div>
    //       <table className="w-full text-left table-auto mb-6">
    //         <thead>
    //           <tr>
    //             <th className="px-4 py-2">Date</th>
    //             <th className="px-4 py-2">Open</th>
    //             <th className="px-4 py-2">High</th>
    //             <th className="px-4 py-2">Low</th>
    //             <th className="px-4 py-2">Close</th>
    //             <th className="px-4 py-2">Volume</th>
    //           </tr>
    //         </thead>
    //         <tbody>
    //           <tr>
    //             <td className="border px-4 py-2">{eodData.date}</td>
    //             <td className="border px-4 py-2">{eodData.open}</td>
    //             <td className="border px-4 py-2">{eodData.high}</td>
    //             <td className="border px-4 py-2">{eodData.low}</td>
    //             <td className="border px-4 py-2">{eodData.close}</td>
    //             <td className="border px-4 py-2">{eodData.volume}</td>
    //           </tr>
    //         </tbody>
    //       </table>

    //       {/* Line Chart for Closing Price */}
    //       {/* Optional: You can integrate a chart library like Chart.js here */}
    //     </div>
    //   ) : (
    //     !isLoading && <p>No EOD data available.</p>
    //   )}
    // </div>
  );
};

export default StockPrices;
