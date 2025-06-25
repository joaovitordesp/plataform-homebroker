import amqp from "amqplib";

async function main() {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    await channel.assertExchange("test", "direct", { durable: true });
    await channel.assertQueue("test.a", { durable: true });
    channel.bindQueue("test.a", "test", "");
    const input = {
        a: 1
    }
    await channel.publish("test", "", Buffer.from(JSON.stringify(input)));
}

main();