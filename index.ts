// const nombre = "Matias";
// console.log(`Mi nombre es ${ nombre }`);

//import { SERVER_PORT } from "./global/environment";
import Server from './classes/server';
import router from './routes/router';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import express from 'express';

// si en router.ts lo explorto de la siguiente manera
// const router = Router();
// export default router;
// puedo usar la importacion sin llaves
// import router from "./routes/router";

// si en cambio lo exporto de la siguiente manera
// export const router = Router();
// tengo que usar la importacion con llaves
// import { router } from "./routes/router";

// Patron SINGLETON, es una configuración adicional a mi clase Server para asegurarme de tener
// una UNICA instancia del servidor de socktes como de todas las propiedades de mi clase Server.
// const server = new Server();
const server = Server.instance; // obtenemos una nueva instancia de forma estática

const publicPath = path.resolve(__dirname, '../public');
console.log(__dirname);
server.app.use(express.static(publicPath));

// Lo que reciba por el body, lo toma y lo convierte en un objeto de JavaScript
server.app.use(bodyParser.urlencoded({ extended: true }));
server.app.use(bodyParser.json());

// CORS
server.app.use(cors({ origin: true, credentials: true })); // permito que cualquier persona puede llamar mis servicios.
server.app.use('/', router);

server.start(() => {
	//console.log(`Servidor corriendo en el puerto ${ SERVER_PORT }`);
	console.log(`Servidor corriendo en el puerto ${server.port}`); // ES lo mismo que que ${ SERVER_PORT }
});
