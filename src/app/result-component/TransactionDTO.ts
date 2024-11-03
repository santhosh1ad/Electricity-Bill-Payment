export interface User {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  billingAddress: string;
  createdAt: string;
}
export interface Transaction {
  id: number;
  amount: number;
  status: string;
  transactionDate: string;
  referenceNumber: string;
  user: User;
  customerId: string;
  mop: string;
  customer: string;
}
