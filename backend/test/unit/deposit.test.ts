test("Should be able to deposit", async () => {
  const deposit = {
    accountId: "123",
    assetId: "BTC",
    quantity: 1.7,
  };

  const result = await depositService.create(deposit);

  expect(result).toBeDefined();
  expect(result.id).toBeDefined();
  expect(result.accountId).toBe(deposit.accountId);
  expect(result.assetId).toBe(deposit.assetId);
  expect(result.quantity).toBe(deposit.quantity);
});

test("Should not be able to deposit with quantity less than or equal to zero", async () => {
  // Teste com quantidade zero
  const depositZero = {
    accountId: "valid-account-id",
    assetId: "btc",
    quantity: 0,
  };

  await expect(depositService.create(depositZero)).rejects.toThrow(
    "Quantity must be greater than zero"
  );

  // Teste com quantidade negativa
  const depositNegative = {
    accountId: "valid-account-id",
    assetId: "btc",
    quantity: -1.5,
  };

  await expect(depositService.create(depositNegative)).rejects.toThrow(
    "Quantity must be greater than zero"
  );
});
