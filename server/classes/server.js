"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const socket_io_1 = __importDefault(require("socket.io"));
const http_1 = __importDefault(require("http")); // express levanta un servidor http, por eso es que son compatibles.
const socket = __importStar(require("../sockets/sockets"));
const environment_1 = require("../global/environment");
class Server {
    // httpServer va a ser el server que vamos a levantar, y no la app de express.
    constructor() {
        this.app = express_1.default();
        this.port = environment_1.SERVER_PORT;
        // le enviamos la confiugarccion de la app de express.
        this.httpServer = new http_1.default.Server(this.app);
        // Configuración de socket.io
        this.io = socket_io_1.default(this.httpServer);
        // sería ideal usar la configuración de express
        // this.io = socketIO( this.app );
        // pero tenemos que usar httpServers
        this.escucharSockets();
    }
    static get instance() {
        // retorna si existe una instancia, sino la crea.
        return this._instance || (this._instance = new this());
    }
    // levantmos el server
    escucharSockets() {
        // privado porque se llama sólo desde la inicialización de la clase
        console.log('Escuchando conexiones de sockets en el puerto ', this.port);
        // Emisión de eventos
        this.io.on('connection', (cliente) => {
            console.log('Cliente conectado', cliente.id);
            // cliente.to(cliente.id).emit('adjuntar-sesion-ticket', cliente.id);
            socket.escucharMensajes(cliente, this.io);
        });
    }
    start(callback) {
        // this.app.listen( this.port, callback );
        this.httpServer.listen(this.port);
    }
}
exports.default = Server;
