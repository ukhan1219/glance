export const getLastMarketDay = (): string => {
    const today = new Date();
    let lastDay = new Date(today);
    lastDay.setDate(today.getDate() - 1); // Start with yesterday
  
    // Loop to skip weekends (Sunday=0, Saturday=6)
    while (lastDay.getDay() === 0 || lastDay.getDay() === 6) {
      lastDay.setDate(lastDay.getDate() - 1);
    }
  
    // Format to YYYY-MM-DD
    return lastDay.toISOString().split('T')[0];
  };