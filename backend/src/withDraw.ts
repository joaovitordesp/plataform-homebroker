import express, { Request, Response } from "express";
import pgp from "pg-promise";
import crypto from "crypto";

const app = express();
const router = express.Router();

const connection = pgp()("postgres://postgres:123456@localhost:5432/app");

function isValidAsset(assetId: string): boolean {
  return ["BTC", "USD"].includes(assetId);
}

function isValidQuantity(quantity: number): boolean {
  return quantity > 0;
}

router.post("/withdraw", async (req: Request, res: Response) => {
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

  const withdraw = {
    withdrawId: crypto.randomUUID(),
    accountId,
    assetId: input.assetId,
    quantity: input.quantity,
    createdAt: new Date(),
  };

  await connection.query(
    "insert into ccca.withdraw (withdraw_id, account_id, asset_id, quantity, created_at) values ($1, $2, $3, $4, $5)",
    [
      withdraw.withdrawId,
      withdraw.accountId,
      withdraw.assetId,
      withdraw.quantity,
      withdraw.createdAt,
    ]
  );

  return res.status(201).json(withdraw);
});

app.use(router);
app.listen(3000);
