"use client";

import React, { useState, useEffect, useRef } from "react";
import NotAuthorizedNavBar from "../_components/notauthorizedNavBar";
import PlaidLink from "../_components/PlaidLink";
import StockPrices from '../_components/StockPrices';  // Import StockPrices component
import Chart from "chart.js/auto";
import { Transaction } from '../_components/types';
import { getServerAuthSession } from "~/server/auth";
import { redirect } from "next/navigation";
import { api } from '~/trpc/react';

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
  const [balance, setBalance] = useState<string | null>(() => {
    return localStorage.getItem("balance") || null;
  });
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const savedTransactions = localStorage.getItem("transactions");
    return savedTransactions ? JSON.parse(savedTransactions) : [];
  });
  const [publicToken, setPublicToken] = useState<string | null>(() => {
    return localStorage.getItem("publicToken") || null;
  });
  const [savingsRec, setSavingsRec] = useState<string>(() => {
    return localStorage.getItem("savingsRec") || "";
  });
  const chartRef = useRef<Chart<"pie", number[], string> | null>(null);

  const getAnalytics = api.gemini.getAnalytics.useMutation();

  // Save the state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("balance", balance || "");
  }, [balance]);

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem("publicToken", publicToken || "");
  }, [publicToken]);

  useEffect(() => {
    localStorage.setItem("savingsRec", savingsRec || "");
  }, [savingsRec]);

  // Calculate total expenses by summing up all the transaction amounts
  const totalExpenses = transactions.reduce((acc, transaction) => {
    return acc + transaction.amount;
  }, 0);

  useEffect(() => {
    if (transactions.length === 0) return;

    const transactionSummary = transactions
      .map(transaction => `${transaction.merchantName}: $${transaction.amount} on ${transaction.date}, categorized as ${transaction.category}`)
      .join(", ");

    // Call the Gemini API to get analytics
    getAnalytics.mutate(
      { transactions: transactionSummary },
      {
        onSuccess: (data) => {
          if (data?.text) {
            setSavingsRec(data.text);  // Update the state with the response from the API
          }
        },
      }
    );

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
            const category = transaction.category && transaction.category[0] ? transaction.category[0] : "Uncategorized";
            if (categoryData[category]) {
              categoryData[category] += transaction.amount;
            } else {
              categoryData[category] = transaction.amount;
            }
          });

          console.log(transactions);
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
      <div className="bg-[#292464] text-white p-5 flex space-x-5 h-[35vh]">
        <div className="bg-site-foreground w-3/5 h-[115%] rounded-lg relative p-10">
          {/* Balance at the Top Left */}
          <div className="absolute top-5 left-5">
            <p className="fira-sans-regular text-4xl font-bold">
              <span className="text-green-400 ml-4">${balance || "N/A"}</span>
            </p>
          </div>

          {/* Transactions rendering directly under the balance */}
          <div className="mt-5"> {/* Reduced spacing */}
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
          {/* Button for Plaid link */}
          {publicToken === null && (
            <div className="absolute bottom-5 left-5">
              <button
                className="bg-[#292464] text-white px-4 py-2 rounded-lg"
                onClick={handleConnectBank}
              >
                Connect A Bank With Plaid
              </button>
            </div>
          )}
        </div>

        {/* Right Foreground Div */}
        <div className="bg-site-foreground w-2/5 h-[115%] rounded-lg relative p-10">
          <div className="justify-center left-0 p-2">

            {/* Chart Container */}
            <div className="rounded-lg p-0 md:p-0 overflow-hidden">
            <div className="absolute top-0 left-0 w-full flex justify-center p-2">
                <dl>
                  <dt className="text-base font-normal text-gray-500 dark:text-gray-400 pb-1"></dt>
                  <dd className="leading-none text-xl font-bold text-green-500 dark:text-green-400"></dd>
                </dl>
                <dl>
                  <dt className="text-base font-normal text-gray-500 dark:text-gray-400 pb-1">
          
                  </dt>
                  <dd className="leading-none text-xl font-bold text-red-600 dark:text-red-500">
                   
                  </dd>
                </dl>
              </div>

              {/* Chart.js canvas */}
              <div className="relative h-72 w-full flex justify-center items-start">
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

        {/* Right Foreground Div */}
        <div className="bg-site-foreground w-full h-[115%] rounded-lg relative p-10">
          {/* Centered Connect Brokerage Button */}
          <div className="absolute inset-0 flex items-center justify-center">
          </div>

          {/* Bottom-left Money Invested text */}
          <div className="bg-site-foreground absolute bottom-0 left-0 p-2 flex items-center justify-center h-full">
            <div>
              <p className="bg-site-foreground fira-sans-regular absolute bottom-0 left-0 p-2">Personalized savings recommendations:</p>
              <p className="fira-sans-regular text-l font-bold">{savingsRec}</p> {/* Display personalized recommendations here */}
            </div>
          </div>
          </div>
        </div>
      </div>
  );
}
