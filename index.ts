//import { SERVER_PORT } from "./global/environment";
import Server from './classes/server';

// ROUTES
import publicRoutes from './routes/public.routes';
import ticketRoutes from './routes/ticket.routes';
import userRoutes from './routes/user.routes';

import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import express from 'express';
import mongoose from 'mongoose';

// si en router.ts lo explorto de la siguiente manera
// const router = Router();
// export default router;
// puedo usar la importacion sin llaves
// import router from "./routes/router";

// si en cambio lo exporto de la siguiente manera
// export const router = Router();
// tengo que usar la importacion con llaves
// import { router } from "./routes/router";
import environment from './global/environment';
// Patron SINGLETON, es una configuración adicional a mi clase Server para asegurarme de tener
// una UNICA instancia del servidor de socktes como de todas las propiedades de mi clase Server.
// const server = new Server();
const server = Server.instance; // obtenemos una nueva instancia de forma estática



const publicPath = path.resolve(__dirname, '../public');
server.app.use(express.static(publicPath));

// Lo que reciba por el body, lo toma y lo convierte en un objeto de JavaScript
server.app.use(bodyParser.urlencoded({ extended: true }));
server.app.use(bodyParser.json());

// CORS
server.app.use(cors({ origin: true, credentials: true })); // permito que cualquier persona puede llamar mis servicios.


// RUTAS
server.app.use('/p', publicRoutes);
server.app.use('/u', userRoutes);
server.app.use('/t', ticketRoutes);

server.start(() => {
	console.log(`Servidor corriendo en el puerto ${server.port}`); // ES lo mismo que que ${ SERVER_PORT }
});

// MONGO DB
mongoose
	// .connect('mongodb://localhost:27017/webturnos', {
	.connect(environment.DB_CONN_STR, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true,
		useFindAndModify: false
	})
	.then(() => {
		console.log('MongoDB corriendo en el puerto 27017: \x1b[32m%s\x1b[0m', 'ONLINE');
	})
	.catch((err) => {
		throw err;
	}); 

