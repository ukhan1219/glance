import axios from 'axios';

const API_KEY = 'pYiOYNpAQbp7pMDt1HbanBO0457BANpt'; 

// Fetch real-time stock data
export async function getRealTimeStockData(symbol: string) {
  try {
    const url = `https://api.polygon.io/v2/last/trade/${symbol}?apiKey=${API_KEY}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching stock data:', error);
    throw error;
  }
}
