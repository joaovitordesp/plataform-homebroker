import Order from "../../domain/Order";
import OrderDAO from "../../infra/repository/OrderRepository";

export default class PlaceOrder {
  constructor(readonly orderDAO: OrderDAO) {}

  async execute(input: Input): Promise<Output> {
    const order = Order.create(
      input.marketId,
      input.accountId,
      input.side,
      input.quantity,
      input.price
    );
    await this.orderDAO.saveOrder(order);
    return {
      orderId: order.orderId,
    };
  }
}

type Input = {
  marketId: string;
  accountId: string;
  side: string;
  quantity: number;
  price: number;
};

type Output = {
  orderId: string;
};
