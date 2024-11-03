export interface User {
  id: number;
  name: string;
  email: string;
  address: string;
}

export interface Transaction {
  id: number;
  amount: number;
  status: string;
  transactionDate: Date;
  customerId: string;
  customer: string;
  mop: string;
  user: User;
  referenceNumber: string;
}
