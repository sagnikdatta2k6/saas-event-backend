import { Response } from 'express';
import prisma from '../prisma';
import { AuthRequest } from '../middleware/auth.middleware';

export const getAnalytics = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const organizationId = req.user?.organizationId;

    // 1. Get all events for this Organization
    const events = await prisma.event.findMany({
      where: { organizationId },
      include: { tickets: true } // We need this to count the tickets!
    });

    // 2. Calculate the Stats
    const totalEvents = events.length;
    
    // Count all tickets across all events
    const totalTicketsSold = events.reduce((sum, event) => sum + event.tickets.length, 0);
    
    // Calculate money: (Tickets Sold * Price) for each event
    const totalRevenue = events.reduce((sum, event) => {
      return sum + (event.tickets.length * Number(event.price));
    }, 0);

    // 3. Return the Report
    res.json({
      organizationId,
      totalEvents,
      totalTicketsSold,
      totalRevenue,
      eventsBreakdown: events.map(event => ({
        title: event.title,
        sold: event.tickets.length,
        revenue: event.tickets.length * Number(event.price)
      }))
    });

  } catch (error) {
    res.status(500).json({ message: 'Error fetching analytics', error });
  }
};