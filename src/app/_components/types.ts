// src/types.ts or components/types.ts (depending on your folder structure)

export interface Transaction {
    amount: number;
    category: string[];
    date: string;
    merchantName: string;
  }