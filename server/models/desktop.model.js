"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const desktopSchema = new mongoose_1.Schema({
    id_company: { type: String, required: [true, 'El id_company es necesario'] },
    cd_desktop: { type: String, required: [true, 'El cd_desktop es necesario'] },
    id_assistant: { type: String, required: false },
}, { collection: "desktops" });
exports.Desktop = mongoose_1.model('Desktop', desktopSchema);
