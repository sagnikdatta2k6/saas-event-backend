import { Response } from 'express';
import prisma from '../prisma';
import { AuthRequest } from '../middleware/auth.middleware';

export const createEvent = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { title, description, date, location, totalTickets, price, parentId } = req.body;
    
    // LEVEL 3 MAGIC: Get the Organization ID from the logged-in user's token
    const organizationId = req.user?.organizationId;

    if (!organizationId) {
      return res.status(400).json({ message: 'Organization ID missing from token' });
    }

    const eventDate = new Date(date);

    const event = await prisma.event.create({
      data: {
        title,
        description,
        date: eventDate,
        location,
        totalTickets,
        availableTickets: totalTickets,
        price,
        parentId: parentId || null,
        organizationId: organizationId, // Link event to Org automatically
      },
    });

    res.status(201).json({ message: 'Event created successfully', event });
  } catch (error) {
    res.status(500).json({ message: 'Error creating event', error });
  }
};

export const getEvents = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    // LEVEL 3 MAGIC: Only fetch events for THIS user's organization
    // Even if Org B has 100 events, Org A will see 0 here.
    const organizationId = req.user?.organizationId as string;

    const events = await prisma.event.findMany({
      where: {
        organizationId: organizationId // The Data Wall
      },
      include: {
        subEvents: true // Cleanly show sub-events if they exist
      }
    });

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events', error });
  }
};