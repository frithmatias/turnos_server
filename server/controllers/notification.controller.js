"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const push_1 = require("../notifications/push");
const subscription_model_1 = require("../models/subscription.model");
const web_push_1 = __importDefault(require("web-push"));
const keys = __importStar(require("../notifications/vapid.json"));
web_push_1.default.setVapidDetails('mailto:matiasfrith@gmail.com', // por si los servicios cambian
keys.publicKey, keys.privateKey);
// ========================================================
// Skill Methods
// ========================================================
function notificationSubscribe(req, res) {
    var body = req.body;
    body.expirationTime = +new Date().getTime() + 3600 * 24 * 7;
    var subscription = new subscription_model_1.Subscription(body);
    subscription.save().then(subscriptionSaved => {
        return res.status(200).json({
            ok: true,
            msg: 'Subscripción a notificaciones exitosa',
            subscription: subscriptionSaved
        });
    }).catch(() => {
        return res.status(400).json({
            ok: false,
            msg: 'No se pudo suscribir a las notificaciones',
            subscription: null
        });
    });
}
function notificationKey(req, res) {
    // return res.status(200).json({ 
    return res.status(200).send(// for encoding data with urlsafeBase64
    push_1.getPublicKey());
}
function notificationPush(req, res) {
    const post = {
        title: req.body.title,
        msg: req.body.msg
    };
    subscription_model_1.Subscription.find({}).then((subscriptions) => __awaiter(this, void 0, void 0, function* () {
        let subscriptors = subscriptions.length;
        for (let subscription of subscriptions) {
            yield web_push_1.default.sendNotification(subscription, JSON.stringify(post))
                .then(() => console.log('Notificación enviada'))
                .catch(() => {
                subscriptors--;
                subscription.remove().then((subscriptionRemoved) => {
                    console.log('subscription removed', subscriptionRemoved._id);
                });
            });
        }
        return res.status(200).json({
            ok: true,
            msg: 'Notificaciones enviadas',
            subscriptors
        });
    }));
}
module.exports = {
    notificationSubscribe,
    notificationKey,
    notificationPush
};
