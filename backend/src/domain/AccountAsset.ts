export default class AccountAsset {
  constructor(
    readonly accountId: string,
    readonly assetId: string,
    private quantity: number
  ) {}

  withdraw(quantity: number) {
    if (quantity < this.quantity) throw new Error("Insufficient funds");
    this.quantity -= quantity;
  }

  getQuantity() {
    return this.quantity;
  }
}
