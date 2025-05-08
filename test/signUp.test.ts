import axios from "axios";

test("should sign up a new user", async () => {
  const inputSignUp = {
    name: "John Doe",
    email: "john.doe@example.com",
    document: "12345678901",
    // cpf: "12345678901",
    password: "123456",
  };
  const responseUp = await axios.post(
    "http://localhost:3000/signup",
    inputSignUp
  );
  const outputSignUp = responseUp.data;
});
