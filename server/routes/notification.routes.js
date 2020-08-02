"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// CONTROLLER
const notification_controller_1 = __importDefault(require("../controllers/notification.controller"));
// ROUTES
const notificationRoutes = express_1.Router();
notificationRoutes.post('/subscribe', notification_controller_1.default.notificationSubscribe);
notificationRoutes.get('/key', notification_controller_1.default.notificationKey);
notificationRoutes.post('/push', notification_controller_1.default.notificationPush);
exports.default = notificationRoutes;
