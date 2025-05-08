import express, { Request, Response } from "express";
import crypto from "crypto";
import { validateCpf } from "./validateCpf";

const app = express();
const router = express.Router();
app.use(express.json());

const accounts: any = [];

function isValidName(name: string) {
  return name.match(/[a-zA-Z] [a-zA-Z]+/);
}

function isValidEmail(email: string) {
  return email.match(/^(.+)\@(.+)$/);
}

function isValidPassword(password: string) {
  if (password.length < 8) return false;
  if (!password.match(/\d+/)) return false;
  if (!password.match(/[a-z]+/)) return false;
  if (!password.match(/[A-Z]+/)) return false;
  return true;
}

router.post("/signup", (req: Request, res: Response) => {
  const input: any = req.body;

  if (!isValidName(input.name)) {
    return res.status(422).json({
      error: "Invalid name",
    });
  }

  if (!isValidEmail(input.email)) {
    return res.status(422).json({
      error: "Invalid email",
    });
  }

  if (!validateCpf(input.document)) {
    return res.status(422).json({
      error: "Invalid document",
    });
  }

  if (!isValidPassword(input.password)) {
    return res.status(422).json({
      error: "Invalid password",
    });
  }

  const accountId = crypto.randomUUID();

  const account = {
    accountId,
    name: input.name,
    email: input.email,
    document: input.document,
    password: input.password,
  };

  const nameParts = input.name.split(" ");
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(" ");

  accounts.push(account);

  res.json({ accountId });
});

router.get("/accounts/:accountId", (req: Request, res: Response) => {
  const accountId = req.params.accountId;
  const account = accounts.find(
    (account: any) => account.accountId === accountId
  );

  if (!account) {
    res.status(404).json({ message: "Account not found" });
    return;
  }

  res.json(account);
});

app.use(router);
app.listen(3000);
