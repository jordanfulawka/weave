import express from 'express';
import type { Request, Response } from 'express';
import { createDocument, getUserDocuments } from '../db';
import { httpAuth } from '../middlewares/httpAuth';

const router = express.Router();

router.route('/').get(httpAuth, async (req: Request, res: Response) => {
  try {
    const docs = await getUserDocuments((req as any).id);
    res.status(200).json({ docs });
  } catch (err) {
    res.status(500).json({ error: 'there was an error' });
  }
});

router.route('/').post(httpAuth, async (req: Request, res: Response) => {
  try {
    const { ownerId, title } = req.body;
    const newDoc = await createDocument(ownerId, title);
    res.status(200).json({ newDoc });
  } catch (err) {
    res.status(500).json({ error: 'there was an error' });
  }
});

export default router;
