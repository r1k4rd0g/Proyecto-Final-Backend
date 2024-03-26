import fs from 'fs';
import logger from '../../../../utils/logger/logger.winston.js'

export default class TicketFSDao {
    constructor(path) {
        this.path = path;
    }

    async createTicket(obj) {
        try {
            const ticket = {
                id: await this.#getMaxId() + 1,
                ...obj
            }
            const ticketFile = await this.getAll();
            ticketFile.push(ticket);
            await fs.promises.writeFile(this.path, JSON.stringify(ticketFile));
            return ticket;
        } catch (error) {
            logger.error('Entró en catch de fs - ticket.dao - createTicket' + error);
        }
    }

    async #getMaxId() {
        let maxId = 0;
        const tickets = await this.getAll();
        tickets.map((ticket) => {
            if (ticket.id > maxId) maxId = ticket.id;
        });
        return maxId;
    }

    async getAll() {
        try {
            if (fs.existsSync(this.path)) {
                const tickets = await fs.promises.readFile(this.path, 'utf8');
                const ticketsJS = JSON.parse(tickets);
                return ticketsJS;
            } else {
                return []
            }
        } catch (error) {
            logger.error('Entró en catch de fs - ticket.dao - getAll' + error);
            throw new Error (error)
        }
    }

    async getById(id) {
        try {
            const ticketFile = await this.getAll()
            const ticket = ticketFile.find((t) => t.id === id)
            if (ticket) {
                return ticket
            }
            return false
        } catch (error) {
            logger.error('Entró en catch de fs - ticket.dao - getById' + error);
            throw new Error (error)
        }
    }

    async updateTicket(obj, id) {
        try {
            const ticketFile = await this.getAll();
            const index = ticketFile.findIndex(t => t.id === id)
            if (index === -1) {
                throw new Error(`Id ${id} not found`)
            } else {
                ticketFile[index] = { ...obj, id };
            }
            await fs.promises.writeFile(this.path, JSON.stringify(ticketFile));
        } catch (error) {
            logger.error('Entró en catch de fs - ticket.dao - updateTicket' + error);
            throw new Error (error)
        }
    }

    async deletTicket(id) {
        try {
            const ticketFile = await this.getAll()
            if (ticketFile.length > 0) {
                const newArray = ticketFile.filter(t => t.id !== id)
                await fs.promises.writeFile(this.path, JSON.stringify(newArray))
            } else {
                throw new Error(`Msg not found`)
            }
        } catch (error) {
            logger.error('Entró en catch de fs - "ticket".dao - deletTicket' + error);
            throw new Error (error)
        }
    }

    async deleteTickets() {
        try {
            if (fs.existsSync(this.path)) {
                await fs.promises.unlink(this.path)
            }
        } catch (error) {
            logger.error('Entró en catch de fs - ticket.dao - deleteTickets' + error);
            throw new Error (error)
        }
    }
}