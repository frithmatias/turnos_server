"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const keys = __importStar(require("../notifications/vapid.json"));
const urlsafe_base64_1 = __importDefault(require("urlsafe-base64"));
// npm install @types/urlsafe-base64
exports.getPublicKey = () => {
    return urlsafe_base64_1.default.decode(keys.publicKey);
};
exports.getPrivateKey = () => {
    return urlsafe_base64_1.default.decode(keys.privateKey);
};
