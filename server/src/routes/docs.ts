import express from 'express';
import type { Request, Response } from 'express';
import {
  createDocument,
  deleteDocument,
  getOwnedDocuments,
  getSharedDocuments,
  updateDocumentTitle,
} from '../db';
import { httpAuth } from '../middlewares/httpAuth';

const router = express.Router();

router.route('/').get(httpAuth, async (req: Request, res: Response) => {
  try {
    const ownedDocs = await getOwnedDocuments((req as any).user.id);
    const sharedDocs = await getSharedDocuments((req as any).user.id);
    res.status(200).json({ ownedDocs, sharedDocs });
  } catch (err) {
    res.status(500).json({ error: 'there was an error' });
  }
});

router.route('/').post(httpAuth, async (req: Request, res: Response) => {
  try {
    const newDoc = await createDocument((req as any).user.id);
    res.status(200).json({ newDoc });
  } catch (err) {
    res.status(500).json({ error: 'there was an error' });
  }
});

router.route('/:id').patch(httpAuth, async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const { title } = req.body;

    if (typeof id !== 'string') {
      return res.status(400).json({ error: 'invalid id' });
    }
    const doc = await updateDocumentTitle(id, title);
    res.status(200).json({ doc });
  } catch (err) {
    res.status(500).json({ error: 'there was an error' });
  }
});

router.route('/:id').delete(httpAuth, async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (typeof id !== 'string') {
      return res.status(400).json({ error: 'invalid id' });
    }
    await deleteDocument(id);
  } catch (err) {
    res.status(500).json({ error: 'there was an error' });
  }
});

export default router;
