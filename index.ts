//import { SERVER_PORT } from "./global/environment";
import Server from './classes/server';
import router from './routes/router';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import express from 'express';

// const server = new Server();
const server = Server.instance; // singleton

// public
const publicPath = path.resolve(__dirname, '../public');
server.app.use(express.static(publicPath));

// evitar problemas de rutas 
const indexPath = path.resolve(__dirname, '../public', 'index.html');
server.app.get("*", (req, res) => {
	res.sendFile(indexPath);
});

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
