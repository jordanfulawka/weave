import express from 'express';
import { httpAuth } from '../middlewares/httpAuth';
import type { Request, Response } from 'express';
import { searchUsers } from '../db';

const router = express.Router();

router.route('/search').get(httpAuth, async (req: Request, res: Response) => {
  try {
    const { q, excludeDocId } = req.query;
    if (typeof q !== 'string' || q.length < 3) {
      return res.status(400).json({ users: [] });
    }
    const users = await searchUsers(
      q,
      (req as any).user.id,
      typeof excludeDocId === 'string' ? excludeDocId : undefined,
    );
    res.status(200).json({ users });
  } catch (err) {
    res.status(500).json({ error: 'there was an error' });
  }
});

export default router;
