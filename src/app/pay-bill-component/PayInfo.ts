export interface UserInfo {
  address: string;
  email: string;
  id: number;
  name: string;
}

export interface PayBillInfo {
  amt: number;
  billGeneratedDate: string;
  customerId: string;
  dueDate: string;
  id: number;
  user: UserInfo;
}
