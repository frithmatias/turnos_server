"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//import { SERVER_PORT } from "./global/environment";
const server_1 = __importDefault(require("./classes/server"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
// ROUTES
const public_routes_1 = __importDefault(require("./routes/public.routes"));
const ticket_routes_1 = __importDefault(require("./routes/ticket.routes"));
const company_routes_1 = __importDefault(require("./routes/company.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const skill_routes_1 = __importDefault(require("./routes/skill.routes"));
const desktop_routes_1 = __importDefault(require("./routes/desktop.routes"));
const assistant_routes_1 = __importDefault(require("./routes/assistant.routes"));
const notification_routes_1 = __importDefault(require("./routes/notification.routes"));
const indicator_routes_1 = __importDefault(require("./routes/indicator.routes"));
const metric_routes_1 = __importDefault(require("./routes/metric.routes"));
const superuser_routes_1 = __importDefault(require("./routes/superuser.routes"));
const environment_1 = __importDefault(require("./global/environment"));
// SINGLETON
// const server = new Server();
const server = server_1.default.instance; // obtenemos una nueva instancia de forma estática
// force ssl
server.app.use(function (req, res, next) {
    var _a, _b;
    let hostname = (_b = (_a = req.headers) === null || _a === void 0 ? void 0 : _a.host) === null || _b === void 0 ? void 0 : _b.split(':')[0]; // localhost
    if (req.protocol === 'http' && hostname !== 'localhost') {
        res.redirect('https://' + req.headers.host + req.url);
    }
    else {
        next();
    }
});
const publicPath = path_1.default.resolve(__dirname, '../public');
server.app.use(express_1.default.static(publicPath));
// Lo que reciba por el body, lo toma y lo convierte en un objeto de JavaScript
server.app.use(body_parser_1.default.urlencoded({ extended: true }));
server.app.use(body_parser_1.default.json());
// CORS
server.app.use(cors_1.default({ origin: true, credentials: true })); // permito que cualquier persona puede llamar mis servicios.
// RUTAS
server.app.use('/t', ticket_routes_1.default);
server.app.use('/p', public_routes_1.default);
server.app.use('/c', company_routes_1.default);
server.app.use('/u', user_routes_1.default);
server.app.use('/s', skill_routes_1.default);
server.app.use('/d', desktop_routes_1.default);
server.app.use('/a', assistant_routes_1.default);
server.app.use('/n', notification_routes_1.default);
server.app.use('/m', metric_routes_1.default);
server.app.use('/i', indicator_routes_1.default);
server.app.use('/su', superuser_routes_1.default);
server.start(() => {
    console.log(`Servidor corriendo en el puerto ${server.port}`); // ES lo mismo que que ${ SERVER_PORT }
});
// MONGO DB
mongoose_1.default.connect(environment_1.default.DB_CONN_STR, {
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
