import express from 'express';
import type { Request, Response } from 'express';
import {
  addCollaborator,
  createDocument,
  deleteDocument,
  getDocument,
  getGraphData,
  getOwnedDocuments,
  getSharedDocuments,
  isDocumentMember,
  removeCollaborator,
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

router.route('/graph').get(httpAuth, async (req: Request, res: Response) => {
  try {
    const { nodes, links } = await getGraphData((req as any).user.id);
    console.log(nodes);
    res.status(200).json({ nodes, links });
  } catch (error) {
    res.status(500).json({ error: 'there was an error' });
  }
});

router.route('/:id').get(httpAuth, async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (typeof id !== 'string') {
      return res.status(500).json({ error: 'invalid id' });
    }
    const doc = await getDocument(id);
    res.status(200).json({ doc });
  } catch (error) {
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
    // res.status(200).json({ doc });
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
    const doc = await getDocument(id);
    if (doc.owner_id === (req as any).user.id) {
      const result = await deleteDocument(id, (req as any).user.id);
      return res.status(200).json({ result });
    } else {
      if (await isDocumentMember(id, (req as any).user.id)) {
        const result = await removeCollaborator(id, (req as any).user.id);
        return res.status(200).json({ result });
      }
    }
    return res.status(403).json({ error: 'error' });
  } catch (err) {
    res.status(500).json({ error: 'there was an error' });
  }
});

router
  .route('/:id/members')
  .post(httpAuth, async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      if (typeof id !== 'string') {
        return res.status(400).json({ error: 'invalid id' });
      }
      const doc = await getDocument(id);
      if ((req as any).user.id !== doc.owner_id) {
        return res.status(409).json({ error: 'invalid id' });
      }
      const { userId } = req.body;
      if (typeof userId !== 'string') {
        return res.status(400).json({ error: 'invalid id' });
      }
      const result = await addCollaborator(id, userId);
      res.status(200).json({ result });
    } catch (err) {
      res.status(400).json({ error: 'there was an error' });
    }
  });

export default router;
