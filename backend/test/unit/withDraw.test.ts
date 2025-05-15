test("Shoulb be able exist account to withdraw", async () => {
  const account = {
    accountId: "123",
    assetId: "BTC",
    quantity: 1.7,
  };

  const result = await withdrawService.create(account);

  expect(result).toBeDefined();
  expect(result.id).toBeDefined();
  expect(result.accountId).toBe(account.accountId);
  expect(result.assetId).toBe(account.assetId);
  expect(result.quantity).toBe(account.quantity);
});

test("Should not be able to withdraw with quantity less than or equal to zero", async () => {
  const account = {
    accountId: "123",
    assetId: "BTC",
    quantity: 1.7,
  };

  await expect(withdrawService.create(account)).rejects.toThrow(
    "Quantity must be greater than zero"
  );
});

test("Should not be able to withdraw when assetId is not valid", async () => {
  const account = {
    accountId: "123",
    assetId: "BTC",
    quantity: 1.7,
  };

  const result = await expect(withdrawService.create(account)).rejects.toThrow(
    "Invalid asset"
  );

  expect(result).toBeDefined();
  expect(result.accountId).toBeDefined();
  expect(result.assetId).toBe(account.assetId);
});
