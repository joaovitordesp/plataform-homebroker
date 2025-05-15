import { placeOrder } from "../../src/placeOrder";

describe("PlaceOrder", async () => {
  test("Deve criar uma ordem de compra quando a conta existe e tem saldo suficiente", async () => {
    const accounts = [{ id: "account-123" }];
    const balances = [
      { accountId: "account-123", assetId: "USD", quantity: 100000 },
    ];
    const orders: any[] = [];

    const result = await placeOrder(
      {
        accountId: "account-123",
        marketId: "BTC/USD",
        side: "BUY",
        quantity: 1,
        price: 50000,
      },
      { accounts, balances, orders }
    );

    expect(result).toBeDefined();
    expect(result.orderId).toBeDefined();
    expect(orders.length).toBe(1);
    expect(orders[0].accountId).toBe("account-123");
    expect(orders[0].marketId).toBe("BTC/USD");
    expect(orders[0].side).toBe("BUY");
    expect(orders[0].quantity).toBe(1);
    expect(orders[0].price).toBe(50000);
    expect(orders[0].status).toBe("OPEN");
  });

  test("Deve criar uma ordem de venda quando a conta existe e tem saldo suficiente", async () => {
    const accounts = [{ id: "account-123" }];
    const balances = [
      { accountId: "account-123", assetId: "BTC", quantity: 2 },
    ];
    const orders: any[] = [];

    const result = await placeOrder(
      {
        accountId: "account-123",
        marketId: "BTC/USD",
        side: "SELL",
        quantity: 1,
        price: 50000,
      },
      { accounts, balances, orders }
    );

    expect(result).toBeDefined();
    expect(result.orderId).toBeDefined();
    expect(orders.length).toBe(1);
    expect(orders[0].accountId).toBe("account-123");
    expect(orders[0].marketId).toBe("BTC/USD");
    expect(orders[0].side).toBe("SELL");
    expect(orders[0].quantity).toBe(1);
    expect(orders[0].price).toBe(50000);
    expect(orders[0].status).toBe("OPEN");
  });

  const accounts = [{ id: "account-456" }];
  const balances: any = [];
  const orders: any = [];

  await expect(
    placeOrder(
      {
        accountId: "account-inexistente",
        marketId: "BTC/USD",
        side: "BUY",
        quantity: 1,
        price: 50000,
      },
      { accounts, balances, orders }
    )
  ).rejects.toThrow("Conta não encontrada");

  expect(orders.length).toBe(0);
});

test("Não deve criar uma ordem de compra quando não há saldo suficiente", async () => {
  const accounts = [{ id: "account-123" }];
  const balances = [
    { accountId: "account-123", assetId: "USD", quantity: 10000 },
  ];
  const orders: any[] = [];

  await expect(
    placeOrder(
      {
        accountId: "account-123",
        marketId: "BTC/USD",
        side: "BUY",
        quantity: 1,
        price: 50000,
      },
      { accounts, balances, orders }
    )
  ).rejects.toThrow("Saldo insuficiente");

  expect(orders.length).toBe(0);
});

test("Não deve criar uma ordem de venda quando não há saldo suficiente", async () => {
  const accounts = [{ id: "account-123" }];
  const balances = [
    { accountId: "account-123", assetId: "BTC", quantity: 0.5 },
  ];
  const orders: any[] = [];

  await expect(
    placeOrder(
      {
        accountId: "account-123",
        marketId: "BTC/USD",
        side: "SELL",
        quantity: 1,
        price: 50000,
      },
      { accounts, balances, orders }
    )
  ).rejects.toThrow("Saldo insuficiente");

  expect(orders.length).toBe(0);
});

test("Não deve criar uma ordem quando o saldo está comprometido com outras ordens", async () => {
  const accounts = [{ id: "account-123" }];
  const balances = [
    { accountId: "account-123", assetId: "USD", quantity: 70000 },
  ];
  const orders: any[] = [
    {
      id: "order-existing",
      accountId: "account-123",
      marketId: "BTC/USD",
      side: "BUY",
      quantity: 0.5,
      price: 50000,
      status: "OPEN",
    },
  ];

  await expect(
    placeOrder(
      {
        accountId: "account-123",
        marketId: "BTC/USD",
        side: "BUY",
        quantity: 1,
        price: 50000,
      },
      { accounts, balances, orders }
    )
  ).rejects.toThrow("Saldo insuficiente considerando ordens abertas");

  expect(orders.length).toBe(1);
});

test("Deve considerar o par correto de ativos ao verificar o saldo", async () => {
  const accounts = [{ id: "account-123" }];
  const balances = [
    { accountId: "account-123", assetId: "ETH", quantity: 10 },
    { accountId: "account-123", assetId: "BTC", quantity: 0 },
  ];
  const orders: any[] = [];

  await expect(
    placeOrder(
      {
        accountId: "account-123",
        marketId: "BTC/ETH",
        side: "SELL",
        quantity: 1,
        price: 15,
      },
      { accounts, balances, orders }
    )
  ).rejects.toThrow("Saldo insuficiente");

  expect(orders.length).toBe(0);
});
