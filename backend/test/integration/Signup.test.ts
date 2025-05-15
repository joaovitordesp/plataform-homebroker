import axios from "axios";
import SignUp from "../../src/SignUp";
import { AccountDAODatabase, AccountDAOMemory } from "../../src/AccountDAO";
import GetAccount from "../../src/GetAccount";
import sinon from "sinon";
import Signup from "../../src/SignUp";

axios.defaults.validateStatus = () => true;

let signup: SignUp;
let getAccount: GetAccount;

beforeEach(() => {
  const accountDAO = new AccountDAODatabase();
  // const accountDAO = new AccountDAOMemory();
  signup = new SignUp(accountDAO);
  getAccount = new GetAccount(accountDAO);
});

test("Should create a new account", async () => {
  const inputSignup = {
    name: "John Doe",
    email: "john.doe@gmail.com",
    document: "97456321558",
    password: "asdQWE123",
  };
  const outputSignup = await signup.execute(inputSignup);
  expect(outputSignup.accountId).toBeDefined();
  const outputGetAccount = await getAccount.execute(outputSignup.accountId);
  expect(outputGetAccount.name).toBe(inputSignup.name);
  expect(outputGetAccount.email).toBe(inputSignup.email);
  expect(outputGetAccount.document).toBe(inputSignup.document);
});

test("Should not create an account with invalid name", async () => {
  const inputSignup = {
    name: "John",
    email: "john.doe@gmail.com",
    document: "97456321558",
    password: "asdQWE123",
  };
  await expect(() => signup.execute(inputSignup)).rejects.toThrow(
    "Invalid name"
  );
});

test("Should not create an account with invalid email", async () => {
  const inputSignup = {
    name: "John Doe",
    email: "john.doe",
    document: "97456321558",
    password: "asdQWE123",
  };
  await expect(() => signup.execute(inputSignup)).rejects.toThrow(
    "Invalid email"
  );
});

test("Should not create an account with invalid document", async () => {
  const inputSignup = {
    name: "John Doe",
    email: "john.doe@gmail.com",
    document: "7897897897",
    password: "asdQWE123",
  };
  await expect(() => signup.execute(inputSignup)).rejects.toThrow(
    "Invalid document"
  );
});

test("Should not create an account with invalid password", async () => {
  const inputSignup = {
    name: "John Doe",
    email: "john.doe@gmail.com",
    document: "97456321558",
    password: "asdQWE",
  };
  await expect(() => signup.execute(inputSignup)).rejects.toThrow(
    "Invalid password"
  );
});

test("Should create a new account with stub", async () => {
  const saveAccountStub = sinon
    .stub(AccountDAODatabase.prototype, "saveAccount")
    .resolves();
  const inputSignup = {
    name: "John Doe",
    email: "john.doe@gmail.com",
    document: "97456321558",
    password: "asdQWE123",
  };
  const getAccountByIdStub = sinon
    .stub(AccountDAODatabase.prototype, "getAccountById")
    .resolves(inputSignup);
  const getAccountAssets = sinon
    .stub(AccountDAODatabase.prototype, "getAccountAssets")
    .resolves([]);
  const outputSignup = await signup.execute(inputSignup);
  expect(outputSignup.accountId).toBeDefined();
  const outputGetAccount = await getAccount.execute(outputSignup.accountId);
  expect(outputGetAccount.name).toBe(inputSignup.name);
  expect(outputGetAccount.email).toBe(inputSignup.email);
  expect(outputGetAccount.document).toBe(inputSignup.document);
  saveAccountStub.restore();
  getAccountByIdStub.restore();
  getAccountAssets.restore();
});

test("Should create a new account with spy", async () => {
  const saveAccountSpy = sinon.spy(AccountDAODatabase.prototype, "saveAccount");
  const inputSignup = {
    name: "John Doe",
    email: "john.doe@gmail.com",
    document: "97456321558",
    password: "asdQWE123",
  };
  const outputSignup = await signup.execute(inputSignup);
  expect(outputSignup.accountId).toBeDefined();
  const outputGetAccount = await getAccount.execute(outputSignup.accountId);
  expect(outputGetAccount.name).toBe(inputSignup.name);
  expect(outputGetAccount.email).toBe(inputSignup.email);
  expect(outputGetAccount.document).toBe(inputSignup.document);
  expect(saveAccountSpy.calledOnce).toBe(true);
  expect(
    saveAccountSpy.calledWith(Object.assign(inputSignup, outputSignup))
  ).toBe(true);
  saveAccountSpy.restore();
});

test("Should create a new account with mock", async () => {
  const accountDAOMock = sinon.mock(AccountDAODatabase.prototype);
  accountDAOMock.expects("saveAccount").once().resolves();
  const inputSignup = {
    name: "John Doe",
    email: "john.doe@gmail.com",
    document: "97456321558",
    password: "asdQWE123",
  };
  accountDAOMock.expects("getAccountById").once().resolves(inputSignup);
  accountDAOMock.expects("getAccountAssets").once().resolves([]);
  const outputSignup = await signup.execute(inputSignup);
  expect(outputSignup.accountId).toBeDefined();
  const outputGetAccount = await getAccount.execute(outputSignup.accountId);
  expect(outputGetAccount.name).toBe(inputSignup.name);
  expect(outputGetAccount.email).toBe(inputSignup.email);
  expect(outputGetAccount.document).toBe(inputSignup.document);
  accountDAOMock.verify();
  accountDAOMock.restore();
});

test("Should create a new account fake", async () => {
  const accountDAO = new AccountDAOMemory();
  signup = new Signup(accountDAO);
  getAccount = new GetAccount(accountDAO);
  const inputSignup = {
    name: "John Doe",
    email: "john.doe@gmail.com",
    document: "97456321558",
    password: "asdQWE123",
  };
  const outputSignup = await signup.execute(inputSignup);
  expect(outputSignup.accountId).toBeDefined();
  const outputGetAccount = await getAccount.execute(outputSignup.accountId);
  expect(outputGetAccount.name).toBe(inputSignup.name);
  expect(outputGetAccount.email).toBe(inputSignup.email);
  expect(outputGetAccount.document).toBe(inputSignup.document);
});
