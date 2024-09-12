import main from './app';
import { unexpectedErrorHandler, gracefullyShutdown } from './tools/exit-handler';


const startServer = async () => {
	const app = await main()

	process.on('uncaughtException', (err) => unexpectedErrorHandler(app, err))
    process.on('unhandledRejection', (err) => unexpectedErrorHandler(app, err))
    process.on('SIGTERM', () => gracefullyShutdown(app))
    process.on('SIGINT', () => gracefullyShutdown(app))

	try {
		await app.listen({ port: 5500, host: '0.0.0.0' });
	} catch (err) {
		app.log.error(err);
		process.exit(1);
	}
}

startServer();