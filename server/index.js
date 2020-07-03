"use strict";
// const nombre = "Matias";
// console.log(`Mi nombre es ${ nombre }`);
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//import { SERVER_PORT } from "./global/environment";
const server_1 = __importDefault(require("./classes/server"));
const router_1 = __importDefault(require("./routes/router"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
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
const server = server_1.default.instance; // obtenemos una nueva instancia de forma estática
const publicPath = path_1.default.resolve(__dirname, '../public');
console.log(__dirname);
server.app.use(express_1.default.static(publicPath));
// Lo que reciba por el body, lo toma y lo convierte en un objeto de JavaScript
server.app.use(body_parser_1.default.urlencoded({ extended: true }));
server.app.use(body_parser_1.default.json());
// CORS
server.app.use(cors_1.default({ origin: true, credentials: true })); // permito que cualquier persona puede llamar mis servicios.
server.app.use('/', router_1.default);
server.start(() => {
    //console.log(`Servidor corriendo en el puerto ${ SERVER_PORT }`);
    console.log(`Servidor corriendo en el puerto ${server.port}`); // ES lo mismo que que ${ SERVER_PORT }
});
