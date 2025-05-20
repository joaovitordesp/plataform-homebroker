import axios from "axios";
import SignUp from "../../src/application/usecase/SignUp";
import {
  AccountRepositoryDatabase,
  AccountRepositoryMemory,
} from "../../src/infra/repository/AccountRepository";
import GetAccount from "../../src/application/usecase/GetAccount";
import sinon from "sinon";
import Signup from "../../src/application/usecase/SignUp";
import Account from "../../src/domain/Account";
import DatabaseConnection, {
  PgPromiseAdapter,
} from "../../src/infra/database/DatabaseConnection";
axios.defaults.validateStatus = () => true;

let signup: SignUp;
let getAccount: GetAccount;
let connection: DatabaseConnection;

beforeEach(() => {
  sinon.restore();
  connection = new PgPromiseAdapter();
  const accountRepository = new AccountRepositoryDatabase(connection);
  // const accountRepository = new AccountRepositoryMemory();
  signup = new SignUp(accountRepository);
  getAccount = new GetAccount(accountRepository);
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

test("Should create a new account with stub", async () => {
  const saveAccountStub = sinon
    .stub(AccountRepositoryDatabase.prototype, "saveAccount")
    .resolves();
  const inputSignup = {
    name: "John Doe",
    email: "john.doe@gmail.com",
    document: "97456321558",
    password: "asdQWE123",
  };
  const getAccountByIdStub = sinon
    .stub(AccountRepositoryDatabase.prototype, "getAccountById")
    .resolves(
      Account.create(
        inputSignup.name,
        inputSignup.email,
        inputSignup.document,
        inputSignup.password
      )
    );
  const getAccountAssets = sinon
    .stub(AccountRepositoryDatabase.prototype, "getAccountAssets")
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
  const saveAccountSpy = sinon.spy(
    AccountRepositoryDatabase.prototype,
    "saveAccount"
  );
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
  const account = new Account(
    outputSignup.accountId,
    inputSignup.name,
    inputSignup.email,
    inputSignup.document,
    inputSignup.password
  );
  expect(saveAccountSpy.calledWith(account)).toBe(true);
  saveAccountSpy.restore();
});

test("Should create a new account with mock", async () => {
  const accountRepositoryMock = sinon.mock(AccountRepositoryDatabase.prototype);
  accountRepositoryMock.expects("saveAccount").once().resolves();
  const inputSignup = {
    name: "John Doe",
    email: "john.doe@gmail.com",
    document: "97456321558",
    password: "asdQWE123",
  };
  accountRepositoryMock.expects("getAccountById").once().resolves(inputSignup);
  accountRepositoryMock.expects("getAccountAssets").once().resolves([]);
  const outputSignup = await signup.execute(inputSignup);
  expect(outputSignup.accountId).toBeDefined();
  const outputGetAccount = await getAccount.execute(outputSignup.accountId);
  expect(outputGetAccount.name).toBe(inputSignup.name);
  expect(outputGetAccount.email).toBe(inputSignup.email);
  expect(outputGetAccount.document).toBe(inputSignup.document);
  accountRepositoryMock.verify();
  accountRepositoryMock.restore();
});

test("Should create a new account with fake", async () => {
  const accountRepository = new AccountRepositoryMemory();
  signup = new Signup(accountRepository);
  getAccount = new GetAccount(accountRepository);
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

afterEach(async () => {
  sinon.restore();
  await connection.close();
});
