"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Ticket {
    constructor(id_ticket, id_desk, status, start, end) {
        this.id_ticket = id_ticket;
        this.id_desk = id_desk;
        this.status = status;
        this.start = start;
        this.end = end;
        this.id_desk = null;
        this.status = 'ES';
        this.start = new Date().getTime();
        this.end = null;
    }
}
exports.Ticket = Ticket;
