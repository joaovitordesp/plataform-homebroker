import Account from "../../src/domain/Account";

test("Should be create new account", () => {
  const account = Account.create(
    "John Doe",
    "john.doe@gmail.com",
    "97456321558",
    "asdQWE123"
  );
  expect(account).toBeDefined();
});

test("Should not be create new account with invalid name", () => {
  expect(() =>
    Account.create("John", "john.doe@gmail.com", "97456321558", "asdQWE123")
  ).toThrow(new Error("Invalid name"));
});

test("Should not be create new account with invalid email", () => {
  expect(() =>
    Account.create("John Doe", "john.doe", "97456321558", "asdQWE123")
  ).toThrow(new Error("Invalid email"));
});

test("Should not be create new account with invalid document", () => {
  expect(() =>
    Account.create("John Doe", "john.doe@gmail.com", "974563215", "asdQWE123")
  ).toThrow(new Error("Invalid document"));
});

test("Should not be create new account with invalid password", () => {
  expect(() =>
    Account.create("John Doe", "john.doe@gmail.com", "97456321558", "asdQWE")
  ).toThrow(new Error("Invalid password"));
});
