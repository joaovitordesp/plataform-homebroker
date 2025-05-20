import crypto from "crypto";

export default class Order {
  constructor(
    readonly orderId: string,
    readonly marketId: string,
    readonly accountId: string,
    readonly side: string,
    readonly quantity: number,
    readonly price: number,
    readonly status: string,
    readonly timeStamp: Date
  ) {}

  static create(
    marketId: string,
    accountId: string,
    side: string,
    quantity: number,
    price: number
  ) {
    const status = "open";
    const timeStamp = new Date();
    const order = new Order(
      crypto.randomUUID(),
      marketId,
      accountId,
      side,
      quantity,
      price,
      status,
      timeStamp
    );
    return order;
  }
}
