import React, { useEffect, useState } from "react";
import { api } from '~/src/app/api'; 

interface StockData {
  ticker: string;
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

const StockPrices = () => {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStockPrices = async () => {
      try {
        const { eodData } = await api.polygon.getLatestEODData.mutate(); // Fetch EOD data using tRPC
        setStocks(eodData);
      } catch (err) {
        console.error("Error fetching stock prices:", err);
        setError("Failed to fetch stock prices.");
      } finally {
        setLoading(false);
      }
    };

    fetchStockPrices();
  }, []);

  if (loading) {
    return <div>Loading stock prices...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="stock-prices">
      <h2 className="text-xl font-bold mb-4">Stock Prices (End of Day)</h2>
      <ul>
        {stocks.map((stock) => (
          <li key={stock.ticker} className="mb-2">
            <strong>{stock.ticker}</strong> - 
            Date: {stock.date}, Open: ${stock.open}, 
            Close: ${stock.close}, 
            High: ${stock.high}, 
            Low: ${stock.low}, 
            Volume: {stock.volume}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StockPrices;
