"use client";

import React, { useState, useEffect } from "react";
import StockPrices from "../_components/StockPrices"; // Import StockPrices component
import { api } from '~/trpc/react';

export default function InsightsPage() {
  // Initialize investments and personalizedNews from localStorage
  const [investments, setInvestments] = useState<string | null>(() => localStorage.getItem("investments"));
  const [personalizedNews, setPersonalizedNews] = useState<string | null>(() => localStorage.getItem("personalizedNews"));

  const { mutate: getPersonalizedNews } = api.gemini.getPersonalizedNews.useMutation({
    onSuccess: (data) => {
      console.log("Received personalized news:", data);
      setPersonalizedNews(data.text);
      localStorage.setItem("personalizedNews", data.text); // Save news to localStorage
    },
    onError: (error) => {
      console.error("Error fetching personalized news:", error);
    },
  });

  // Trigger Gemini API when the investments are set
  useEffect(() => {
    if (investments && !personalizedNews) {
      console.log("Querying Gemini API for personalized news");
      getPersonalizedNews({ investments });
    }
  }, [investments, personalizedNews, getPersonalizedNews]);

  // Save investments to localStorage when set
  useEffect(() => {
    if (investments) {
      localStorage.setItem("investments", investments);
    }
  }, [investments]);

  return (
    <div className="bg-site-background min-h-screen text-white">
      {/* First Row */}
      <div className="bg-site-background text-white p-5 flex space-x-5 h-[35vh]">
        {/* Left Foreground Div */}
        <div className="bg-site-foreground w-1/3 h-[250%] rounded-lg relative p-10">
          {/* Stock Screener Content */}
          <StockPrices setInvestments={setInvestments} /> {/* Pass setInvestments */}
          
          {/* Screener label */}
          <div className="absolute bottom-0 left-0 p-2">
            <p className="fira-sans-regular">Screener:</p>
          </div>
        </div>

        {/* Right Foreground Div */}
        <div className="bg-site-foreground fira-sans-regular w-2/3 h-[250%] rounded-lg relative p-10">
          {/* Personalized investing news */}
          <div className="absolute bottom-0 left-0 p-2">
            <p className="fira-sans-regular">Personalized investing news:</p>
            </div>
            <div>
              {personalizedNews ? (
                <p>{personalizedNews}</p>
              ) : (
                <p></p>
              )}
            </div>
          </div>
        </div>
      </div>

  );
}
