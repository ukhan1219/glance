"use client";

import React, { useState, useEffect, useRef } from "react";
import NotAuthorizedNavBar from "../_components/notauthorizedNavBar";
import PlaidLink from "../_components/PlaidLink";
import StockPrices from '../_components/StockPrices';
import Chart from "chart.js/auto";
import { Transaction } from '../types';
import { getServerAuthSession } from "~/server/auth";
import { redirect } from "next/navigation";


// Define the Transaction interface
interface Transaction {
  amount: number;
  category: string[];
  date: string;
  merchantName: string;
}

export default function DashboardPage() {
  
  const [openPlaidLink, setOpenPlaidLink] = useState<(() => void) | null>(null);
  const [isPlaidReady, setIsPlaidReady] = useState(false);
  const [balance, setBalance] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [publicToken, setPublicToken] = useState<string | null>(null);
  const chartRef = useRef<Chart<"pie", number[], string> | null>(null);

  // Calculate total expenses by summing up all the transaction amounts
  const totalExpenses = transactions.reduce((acc, transaction) => {
    return acc + transaction.amount;
  }, 0);

  useEffect(() => {
    if (transactions.length === 0) return;

    const timer = setTimeout(() => {
      const chartCanvas = document.getElementById("pie-chart") as HTMLCanvasElement | null;

      if (chartCanvas) {
        if (chartRef.current) {
          chartRef.current.destroy();
        }

        const ctx = chartCanvas.getContext("2d");
        if (ctx) {
          const categoryData: { [key: string]: number } = {};

          transactions.forEach((transaction) => {
            const category = transaction.category[0] || "Uncategorized";
            if (categoryData[category]) {
              categoryData[category] += transaction.amount;
            } else {
              categoryData[category] = transaction.amount;
            }
          });

          const labels = Object.keys(categoryData);
          const data = Object.values(categoryData);

          chartRef.current = new Chart(ctx, {
            type: "pie",
            data: {
              labels,
              datasets: [
                {
                  data,
                  backgroundColor: [
                    "rgba(75, 192, 192, 0.6)",
                    "rgba(255, 99, 132, 0.6)",
                    "rgba(54, 162, 235, 0.6)",
                    "rgba(255, 206, 86, 0.6)",
                    "rgba(153, 102, 255, 0.6)",
                    "rgba(255, 159, 64, 0.6)",
                  ],
                  borderColor: [
                    "rgba(75, 192, 192, 1)",
                    "rgba(255, 99, 132, 1)",
                    "rgba(54, 162, 235, 1)",
                    "rgba(255, 206, 86, 1)",
                    "rgba(153, 102, 255, 1)",
                    "rgba(255, 159, 64, 1)",
                  ],
                  borderWidth: 1,
                },
              ],
            },
            options: {
              responsive: true,
            },
          });
        }
      }
    }, 1000); // Add a small delay

    return () => {
      clearTimeout(timer);
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [transactions]);

  const handleConnectBank = () => {
    if (openPlaidLink && isPlaidReady) {
      openPlaidLink();
    } else {
      console.log("Plaid link is not ready");
    }
  };

  const handlePlaidSuccess = (token: string) => {
    setPublicToken(token);
  };

  return (
    <div className="bg-site-background min-h-screen text-white">
      {/* <NotAuthorizedNavBar /> */}
      <div className="bg-[#292464] text-white p-5 flex space-x-5 h-[35vh]">
        <div className="bg-site-foreground w-3/5 h-[115%] rounded-lg relative p-10">
          <div className="flex justify-start items-start mt-0">
            {publicToken === null ? (
              <button
                className="bg-[#292464] text-white px-4 py-2 rounded-lg"
                onClick={handleConnectBank}
              >
                Connect A Bank With Plaid
              </button>
            ) : null}
          </div>
          <div className="absolute inset-0 flex items-center justify-center p-2" style={{ top: '20%' }}>
            <p className="fira-sans-regular text-4xl font-bold">
              <span className="text-green-400">${balance || "N/A"}</span>
            </p>
          </div>

          {/* Transactions rendering */}
          <div className="mb-4">
            <h2 className="text-2xl font-bold">Recent Transactions</h2>
            <ul>
              {transactions.map((transaction, index) => (
                <li key={index}>
                  {transaction.merchantName}: 
                  <span className="text-red-500"> ${transaction.amount} </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Foreground Div */}
        <div className="bg-site-foreground w-2/5 h-[115%] rounded-lg relative p-10">
          <div className="absolute bottom-0 left-0 p-2">
            <p className="fira-sans-regular">Spending:</p>

            {/* Chart Container */}
            <div className="rounded-lg p-2 md:p-4 overflow-hidden">
              <div className="grid grid-cols-2 py-2">
                <dl>
                  <dt className="text-base font-normal text-gray-500 dark:text-gray-400 pb-1">
                    
                  </dt>
                  <dd className="leading-none text-xl font-bold text-green-500 dark:text-green-400">
                    
                  </dd>
                </dl>
                <dl>
                  <dt className="text-base font-normal text-gray-500 dark:text-gray-400 pb-1">
                    Expense
                  </dt>
                  <dd className="leading-none text-xl font-bold text-red-600 dark:text-red-500">
                    -${totalExpenses.toFixed(2)} {/* Display total expenses dynamically */}
                  </dd>
                </dl>
              </div>

              {/* Chart.js canvas */}
              <div className="relative h-48 w-full">
                <canvas id="pie-chart"></canvas>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Render the PlaidLink component */}
      <PlaidLink
        onOpen={(open, ready) => {
          setOpenPlaidLink(() => open);
          setIsPlaidReady(ready);
        }}
        onSuccess={handlePlaidSuccess}
        setBalance={setBalance}
        setTransactions={setTransactions}
      />

      {/* Second Row */}
      <div className="bg-[#292464] text-white p-5 flex space-x-5 h-[35vh] mt-7">
        {/* Left Foreground Div */}
        <div className="bg-site-foreground w-2/5 h-[115%] rounded-lg relative p-10">
          <div className="absolute bottom-0 left-0 p-2">
            <p className="fira-sans-regular">Market Info:</p>
          </div>
        </div>

        {/* Right Foreground Div */}
        <div className="bg-site-foreground w-3/5 h-[115%] rounded-lg relative p-10">
          {/* Centered Connect Brokerage Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <button className="bg-[#292464] text-white px-4 py-2 rounded-lg">
              Connect Brokerage:
            </button>
          </div>

          {/* Bottom-left Money Invested text */}
          <div className="absolute bottom-0 left-0 p-2">
            <p className="fira-sans-regular">Money Invested:</p>
          </div>
        </div>
      </div>

      {/* Integrated StockPrices Component */}
      <div className="bg-[#292464] text-white p-5 mt-7">
        <StockPrices />
      </div>
    </div>
  );
};
