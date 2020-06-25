import express from 'express';
import socketIO from 'socket.io';
import http from 'http'; // express levanta un servidor http, por eso es que son compatibles.

import * as socket from '../sockets/sockets';
import { SERVER_PORT } from '../global/environment';

export default class Server {
	private static _instance: Server; // private porque no se debería poder llamar desde afuera a la instancia directamente
	public app: express.Application;
	public port: number;
	public io: socketIO.Server;

	// SocketIO necesita recibir la configuración del servidor que esta corriendo en este momento.
	// Nuestra app de express, pero no son compatibles, por eso va a ser http.

	private httpServer: http.Server;
	// httpServer va a ser el server que vamos a levantar, y no la app de express.

	private constructor() {
		this.app = express();
		this.port = SERVER_PORT;
		// le enviamos la confiugarccion de la app de express.

		this.httpServer = new http.Server(this.app);

		// Configuración de socket.io
		this.io = socketIO(this.httpServer);

		// sería ideal usar la configuración de express
		// this.io = socketIO( this.app );
		// pero tenemos que usar httpServers

		this.escucharSockets();
	}

	public static get instance() {
		return this._instance || (this._instance = new this()); // retorna si existe una instancia, sino la crea.
	}

	// levantmos el server

	private escucharSockets() {
		// porque es privado? sólo se va a llamar desde la inicialización de la clase
		console.log('Escuchando conexiones de sockets en el puerto ', this.port);
		this.io.on('connection', (cliente) => {
			// Aca es donde yo emito todos los eventos
			console.log('Cliente conectado', cliente.id);

			// Enviar novedades de turnos
			socket.enviarNovedades(cliente, this.io);
		});
	}

	start(callback: Function) {
		// this.app.listen( this.port, callback );
		this.httpServer.listen(this.port);
	}
}
