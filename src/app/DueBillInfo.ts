export interface DueBill {
  id: number;
  billGeneratedDate: Date;
  amt: number;
  dueDate: Date;
  customerId: string;
  user: User;
  selected?: boolean;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  billingAddress: string;
  createdAt: Date;
}
