"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let env = process.env.NODE_ENV || 'desar';
if (env === 'desar') {
    var desar = require('./environment');
    exports.environment = {
        SEED: desar.SEED,
        GOOGLE_CLIENT_ID: desar.GOOGLE_CLIENT_ID,
        GOOGLE_SECRET: desar.GOOGLE_SECRET,
        DB_CONSTR: desar.DB_CONSTR,
        MAILER_USER: desar.MAILER_USER,
        MAILER_PASS: desar.MAILER_PASS,
        FTP_HOST: desar.FTP_HOST,
        FTP_USER: desar.FTP_USER,
        FTP_PASS: desar.FTP_PASS,
        PRODUCTION: desar.PRODUCTION,
        URL_SERVICES: desar.URL_SERVICES,
        SERVER_PORT: desar.SERVER_PORT
    };
}
else {
    exports.environment = {
        SEED: process.env.SEED,
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
        GOOGLE_SECRET: process.env.GOOGLE_SECRET,
        DB_CONSTR: process.env.DB_CONSTR,
        MAILER_USER: process.env.MAILER_USER,
        MAILER_PASS: process.env.MAILER_PASS,
        FTP_HOST: process.env.FTP_HOST,
        FTP_USER: process.env.FTP_USER,
        FTP_PASS: process.env.FTP_PASS,
        PRODUCTION: process.env.PRODUCTION,
        URL_SERVICES: process.env.URL_SERVICES,
        SERVER_PORT: process.env.PORT
    };
}
