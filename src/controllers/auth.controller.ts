import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../prisma';

export const register = async (req: Request, res: Response): Promise<any> => {
  try {
    // NEW: We now ask for "orgName" too
    const { email, password, name, orgName } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // LEVEL 3 CHANGE: Create Organization AND User in one go
    // This creates an Org, and creates the User linked to that Org
    const organization = await prisma.organization.create({
      data: {
        name: orgName, 
        users: {
          create: {
            email,
            password: hashedPassword,
            name,
            role: 'ADMIN', // The first user is the Admin of the Org
          },
        },
      },
      include: {
        users: true, // Return the user details too
      },
    });

    const user = organization.users[0];

    res.status(201).json({
      message: 'Organization and Admin registered successfully',
      user: { id: user.id, email: user.email, name: user.name, orgId: organization.id },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // LEVEL 3 CHANGE: Include "organizationId" in the token!
    // This allows us to know which Org the user belongs to in every request
    const token = jwt.sign(
      { userId: user.id, role: user.role, organizationId: user.organizationId },
      process.env.JWT_SECRET || 'supersecretkey',
      { expiresIn: '1h' }
    );

    res.json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};