"use client"; // Add this line at the top

import React, { useEffect, useRef } from "react";
import NotAuthorizedNavBar from "../_components/notauthorizedNavBar";
import Chart from "chart.js/auto";

const NewPage = () => {
  const chartRef = useRef<Chart<"pie", number[], string> | null>(null);

  useEffect(() => {
    const chartCanvas = document.getElementById("pie-chart") as HTMLCanvasElement | null;

    if (chartCanvas) {
      if (chartRef.current) {
        chartRef.current.destroy();
      }

      
      const ctx = chartCanvas.getContext("2d");
      if (ctx) {
        chartRef.current = new Chart<"pie", number[], string>(ctx, {
          type: "pie",
          data: {
            labels: ["Income", "Expense"],
            datasets: [
              {
                data: [23635, 18230],
                backgroundColor: ["rgba(75, 192, 192, 0.6)", "rgba(255, 99, 132, 0.6)"],
                borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
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

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className="bg-site-background min-h-screen text-white">
      <NotAuthorizedNavBar />
      {/* First Row */}
      <div className="bg-[#292464] text-white p-5 flex space-x-5 h-[35vh] mt-10">
        {/* Left Foreground Div */}
        <div className="bg-site-foreground w-3/5 h-[115%] rounded-lg relative p-10">
          {/* Centered Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <button className="bg-[#292464] text-white px-4 py-2 rounded-lg">
              Connect Bank:
            </button>
          </div>

          {/* Bottom-left Balance text */}
          <div className="absolute bottom-0 left-0 p-2">
            <p className="fira-sans-regular">TEST DASH:</p>
          </div>
        </div>

        {/* Right Foreground Div */}
        <div className="bg-site-foreground w-2/5 h-[115%] rounded-lg relative p-10">
          <div className="absolute bottom-0 left-0 p-2">
            <p className="fira-sans-regular">Spending:</p>

            {/* Chart Container */}
<div className="rounded-lg  p-2 md:p-4 overflow-hidden">
  <div className="grid grid-cols-2 py-2">
    <dl>
      <dt className="text-base font-normal text-gray-500 dark:text-gray-400 pb-1">
        Income
      </dt>
      <dd className="leading-none text-xl font-bold text-green-500 dark:text-green-400">
        $23,635
      </dd>
    </dl>
    <dl>
      <dt className="text-base font-normal text-gray-500 dark:text-gray-400 pb-1">
        Expense
      </dt>
      <dd className="leading-none text-xl font-bold text-red-600 dark:text-red-500">
        -$18,230
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
    </div>
  );
};

export default NewPage;
