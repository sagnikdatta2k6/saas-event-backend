import { Response } from 'express';
import prisma from '../prisma';
import { AuthRequest } from '../middleware/auth.middleware';
import { io } from '../index'; // Import the socket server

export const bookTicket = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { eventId } = req.body;
    const userId = req.user?.userId;

    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    // 1. Check Event
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (event.availableTickets <= 0) {
      return res.status(400).json({ message: 'Housefull!' });
    }

    // 2. Transaction
    const result = await prisma.$transaction([
      prisma.ticket.create({ data: { userId, eventId } }),
      prisma.event.update({
        where: { id: eventId },
        data: { availableTickets: { decrement: 1 } },
      }),
    ]);

    const updatedEvent = result[1]; // The event with the new ticket count

    // REAL-TIME MAGIC ⚡
    // Send a message to everyone in the room named "eventId"
    io.to(eventId).emit('ticket-update', {
      availableTickets: updatedEvent.availableTickets,
      message: 'A new ticket was just sold!'
    });

    res.status(201).json({ message: 'Ticket booked', ticket: result[0] });

  } catch (error) {
    res.status(500).json({ message: 'Error booking ticket', error });
  }
};