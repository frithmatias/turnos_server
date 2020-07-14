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
const environment_1 = __importDefault(require("../global/environment"));
class Server {
    constructor() {
        this.app = express_1.default();
        this.port = environment_1.default.SERVER_PORT;
        // le enviamos la confiugarccion de la app de express.
        this.httpServer = new http_1.default.Server(this.app);
        // this.io = socketIO( this.app ); // no puedo usar el server http de express directamente uso httpServer
        this.io = socket_io_1.default(this.httpServer);
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
