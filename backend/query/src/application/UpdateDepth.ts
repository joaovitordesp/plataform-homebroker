import DatabaseConnection from "../infra/database/DatabaseConnection";

export default class UpdateDepth {
    constructor(readonly connection: DatabaseConnection) { }

    async execute(input: Input): Promise<void> {
        const [data] = await this.connection.query("SELECT * FROM platform_trading_db.depth WHERE market_id = $1 and side = $2 and price = $3", [input.marketId, input.side, input.price]);

        if (!data) {
            await this.connection.query("INSERT INTO platform_trading_db.depth (market_id, side, price, quantity) VALUES ($1, $2, $3, $4)", [input.marketId, input.side, input.price, input.quantity]);
        } else {
            const quantity = (input.event === "orderPlaced") ? (parseFloat(data.quantity) + input.quantity) : (parseFloat(data.quantity) - input.executedQuantity);
            await this.connection.query("UPDATE platform_trading_db.depth SET quantity = $1 WHERE market_id = $2 and side = $3 and price = $4", [quantity, input.marketId, input.side, input.price]);
        }
    }
}

type Input = {
    marketId: string;
    side: string;
    price: number;
    executedQuantity: number;
    quantity: number;
    event: string; //orderPlaced, orderFilled
}