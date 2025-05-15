type Order = {
  id: string;
  accountId: string;
  marketId: string;
  side: "BUY" | "SELL";
  quantity: number;
  price: number;
  status: "OPEN" | "EXECUTED" | "CANCELLED";
};

type Account = {
  id: string;
};

type Balance = {
  accountId: string;
  assetId: string;
  quantity: number;
};

type Context = {
  accounts: Account[];
  balances: Balance[];
  orders: Order[];
};

type PlaceOrderInput = {
  accountId: string;
  marketId: string;
  side: "BUY" | "SELL";
  quantity: number;
  price: number;
};

type PlaceOrderOutput = {
  orderId: string;
};

export async function placeOrder(
  input: PlaceOrderInput,
  context: Context
): Promise<PlaceOrderOutput> {
  const account = context.accounts.find(
    (account) => account.id === input.accountId
  );
  if (!account) {
    throw new Error("Conta não encontrada");
  }

  const [baseAsset, quoteAsset] = input.marketId.split("/");

  const assetToCheck = input.side === "BUY" ? quoteAsset : baseAsset;

  const balance = context.balances.find(
    (balance) =>
      balance.accountId === input.accountId && balance.assetId === assetToCheck
  );

  const availableBalance = balance ? balance.quantity : 0;

  const requiredAmount =
    input.side === "BUY" ? input.quantity * input.price : input.quantity;

  if (availableBalance < requiredAmount) {
    throw new Error("Saldo insuficiente");
  }

  const openOrders = context.orders.filter(
    (order) =>
      order.accountId === input.accountId &&
      order.status === "OPEN" &&
      order.marketId === input.marketId
  );

  let committedBalance = 0;
  for (const order of openOrders) {
    if (order.side === input.side) {
      committedBalance +=
        order.side === "BUY" ? order.quantity * order.price : order.quantity;
    }
  }

  if (availableBalance - committedBalance < requiredAmount) {
    throw new Error("Saldo insuficiente considerando ordens abertas");
  }

  const newOrder: Order = {
    id: `order-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    accountId: input.accountId,
    marketId: input.marketId,
    side: input.side,
    quantity: input.quantity,
    price: input.price,
    status: "OPEN",
  };

  context.orders.push(newOrder);

  return {
    orderId: newOrder.id,
  };
}
