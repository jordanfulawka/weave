import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { Request, Response } from 'express';
import { createUser, getUserByEmail } from '../db';

const router = express.Router();

router.route('/register').post(async (req: Request, res: Response) => {
  try {
    const { email, username, password } = req.body;
    const passwordHash = await bcrypt.hash(username, 10);
    const newUser = await createUser(email, username, passwordHash);

    if (!process.env.JWT_TOKEN) {
      return res.status(500).json({ error: 'Server misconfiguration' });
    }

    const token = jwt.sign(
      {
        id: newUser.id,
        username: username,
        email: email,
      },
      process.env.JWT_TOKEN,
    );
    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.route('/login').post(async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!process.env.JWT_TOKEN) {
      return res.status(500).json({ error: 'Server misconfiguration' });
    }

    if (passwordMatch) {
      const token = jwt.sign(
        {
          id: user.id,
          username: user.usernmae,
          email: user.email,
        },
        process.env.JWT_TOKEN,
      );
      res.status(200).json({ token });
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }
  } catch (err) {
    res.status(500).json({ error: 'login failed' });
  }
});

export default { authRouter: router };
