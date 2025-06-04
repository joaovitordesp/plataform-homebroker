import pgPromise from "pg-promise";
import { PgPromiseAdapter } from "../../src/infra/database/DatabaseConnection";

function sleep(time: number) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true)
        }, time)
    })
}

async function main() {
    const connection = new PgPromiseAdapter();
    while (true) {
        const result = await connection.query(`SELECT  FLOOR(EXTRACT(EPOCH FROM "timestamp"))::BIGINT AS time, COUNT(*) AS count FROM
            platform_trading_db.order GROUP BY time ORDER BY time desc limit 10`, []);
        console.log(result)
        await sleep(1000)
    }
}

main();