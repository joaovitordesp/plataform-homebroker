import express, { Request, Response } from "express";
import crypto from "crypto";
import pgp from "pg-promise";

const app = express();
const router = express.Router();
app.use(express.json());

const connection = pgp()("postgres://postgres:123456@localhost:5432/app");

function isValidAsset(assetId: string): boolean {
  return ["BTC", "USD"].includes(assetId);
}

function isValidAccount(accountId: string): boolean {
  return accountId.length === 36;
}

function isValidQuantity(quantity: number): boolean {
  return quantity > 0;
}

router.post("/deposit", async (req: Request, res: Response) => {
  const input: any = req.body;

  if (!isValidAsset(input.assetId)) {
    return res.status(422).json({
      error: "Invalid asset",
    });
  }

  if (!isValidQuantity(input.quantity)) {
    return res.status(422).json({
      error: "Invalid quantity",
    });
  }

  const accountId = crypto.randomUUID();

  const deposit = {
    depositId: crypto.randomUUID(),
    accountId,
    assetId: input.assetId,
    quantity: input.quantity,
    createdAt: new Date(),
  };

  await connection.query(
    "insert into ccca.deposit (deposit_id, account_id, asset_id, quantity, created_at) values ($1, $2, $3, $4, $5)",
    [
      deposit.depositId,
      deposit.accountId,
      deposit.assetId,
      deposit.quantity,
      deposit.createdAt,
    ]
  );

  return res.status(201).end();
});

app.use(router);
app.listen(3000);
