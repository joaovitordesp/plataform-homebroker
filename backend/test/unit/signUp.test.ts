import axios from "axios";

axios.defaults.validateStatus = () => true;

test("Should be able to create an account", async () => {
  const inputSignup = {
    name: "John Doe",
    email: "john.doe@gmail.com",
    document: "97456321558",
    password: "asdQWE123",
  };
  const responseSignup = await axios.post(
    "http://localhost:3000/signup",
    inputSignup
  );
  const outputSignup = responseSignup.data;
  expect(outputSignup.accountId).toBeDefined();
  const responseGetAccount = await axios.get(
    `http://localhost:3000/accounts/${outputSignup.accountId}`
  );
  const outputGetAccount = responseGetAccount.data;
  expect(outputGetAccount.name).toBe(inputSignup.name);
  expect(outputGetAccount.email).toBe(inputSignup.email);
  expect(outputGetAccount.document).toBe(inputSignup.document);
});

test("Should not be able to create an account with invalid name", async () => {
  const inputSignup = {
    name: "John",
    email: "john.doe@gmail.com",
    document: "97456321558",
    password: "asdQWE123",
  };
  const responseSignup = await axios.post(
    "http://localhost:3000/signup",
    inputSignup
  );
  const outputSignup = responseSignup.data;
  expect(responseSignup.status).toBe(422);
  expect(outputSignup.error).toBe("Invalid name");
});
