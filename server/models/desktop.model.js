"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const desktopSchema = new mongoose_1.Schema({
    id_company: { type: String, required: [true, 'El id_company es necesario'] },
    id_desktop: { type: String, required: [true, 'El id_desktop es necesario'] },
}, { collection: "desktops" });
exports.Desktop = mongoose_1.model('Desktop', desktopSchema);
