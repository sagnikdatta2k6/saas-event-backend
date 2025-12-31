import { Response } from 'express';
import prisma from '../prisma';
import { AuthRequest } from '../middleware/auth.middleware';

export const registerTeam = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { name, eventId } = req.body;
    const userId = req.user?.userId;

    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    // 1. Check if Event exists
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) return res.status(404).json({ message: 'Event not found' });

    // 2. Create Team AND Add the User as a Member (Transaction)
    // We use a transaction because we don't want an empty team if the member addition fails
    const team = await prisma.team.create({
      data: {
        name,
        eventId,
        members: {
          create: {
            userId: userId
          }
        }
      },
      include: {
        members: true // Return the members list in the response
      }
    });

    res.status(201).json({ message: 'Team registered successfully', team });

  } catch (error) {
    res.status(500).json({ message: 'Error registering team', error });
  }
};