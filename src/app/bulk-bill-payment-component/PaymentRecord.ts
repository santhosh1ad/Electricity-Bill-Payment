export class PayRecord {
  private upiId: string;
  private userId: string;
  private cid: number;
  private customer_id: string;
  private acc: string | null;

  constructor(upiId: string, userId: string, cid: number, customer_id: string) {
    this.upiId = upiId;
    this.userId = userId;
    this.cid = cid;
    this.customer_id = customer_id;
    this.acc = null;
  }

  getUpiId(): string {
    return this.upiId;
  }

  setUpiId(upiId: string): void {
    this.upiId = upiId;
  }

  getUserId(): string {
    return this.userId;
  }

  setUserId(userId: string): void {
    this.userId = userId;
  }

  getCid(): number {
    return this.cid;
  }

  setCid(cid: number): void {
    this.cid = cid;
  }

  getCustomerId(): string {
    return this.customer_id;
  }

  setCustomerId(customer_id: string): void {
    this.customer_id = customer_id;
  }
}
