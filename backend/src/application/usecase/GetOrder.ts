import OrderDAO from "../../infra/repository/OrderRepository";

export default class GetOrder {
  constructor(readonly orderDAO: OrderDAO) {}

  async execute(orderId: string) {
    const orderData = await this.orderDAO.getOrderById(orderId);
    const order = {
      orderId: orderData.orderId,
      marketId: orderData.marketId,
      accountId: orderData.accountId,
      side: orderData.side,
      quantity: orderData.quantity,
      price: orderData.price,
      status: orderData.status,
      timestamp: orderData.timeStamp,
    };
    return order;
  }
}
