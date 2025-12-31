import { Response } from 'express';
import prisma from '../prisma';
import { AuthRequest } from '../middleware/auth.middleware';
import { io } from '../index'; // We import the socket server to broadcast messages!

export const createAnnouncement = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { eventId, title, message } = req.body;
    const organizationId = req.user?.organizationId; // Get the user's Org ID

    // 1. Security Check: Does this event belong to YOUR organization?
    const event = await prisma.event.findFirst({
      where: { 
        id: eventId, 
        organizationId: organizationId 
      }
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found or unauthorized' });
    }

    // 2. Save Announcement to Database
    const announcement = await prisma.announcement.create({
      data: {
        title,
        message,
        eventId
      }
    });

    // 3. REAL-TIME BROADCAST ⚡
    // Send the message to everyone in the "room" for this event
    io.to(eventId).emit('announcement-update', {
      title: announcement.title,
      message: announcement.message,
      createdAt: announcement.createdAt
    });

    res.status(201).json({ message: 'Announcement sent successfully', announcement });

  } catch (error) {
    res.status(500).json({ message: 'Error creating announcement', error });
  }
};