import { PgPromiseAdapter } from "./infra/database/DatabaseConnection";
import { WSSAdapter } from "./infra/websocket/WebSocketServer";
import BookCache from "./infra/cache/BookCache";
import { BookRepositoryDatabase } from "./infra/repository/BookRepository";
import { RabbitMQAdapter } from "./infra/queue/Queue";
import BookQueue from "./infra/queue/BookQueue";

async function main() {
    const websocketServer = new WSSAdapter(3002);
    const connection = new PgPromiseAdapter();
    const queue = new RabbitMQAdapter();
    await queue.connect();
    const bookRepository = new BookRepositoryDatabase(connection);
    const books = await bookRepository.getBooks();
    const bookCache = new BookCache();
    bookCache.load(books);
    BookQueue.config(queue, websocketServer, bookCache);
}

main();