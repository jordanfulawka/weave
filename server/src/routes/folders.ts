import express from 'express';
import type { Request, Response } from 'express';
import { httpAuth } from '../middlewares/httpAuth';
import {
  createFolder,
  deleteFolder,
  getDocument,
  getFolder,
  getFolders,
  updateFolderName,
} from '../db';

const router = express.Router();

router.get('/', httpAuth, async (req: Request, res: Response) => {
  try {
    const folders = await getFolders((req as any).user.id);
    res.status(200).json({ folders });
  } catch (err) {
    res.status(500).json({ error: 'there was an error fetching folders' });
  }
});

router.post('/', httpAuth, async (req: Request, res: Response) => {
  try {
    const name = req.body.name;
    const folder = await createFolder((req as any).user.id, name);
    res.status(201).json({ folder });
  } catch (err) {
    res.status(500).json({ error: 'there was an error creating the folder' });
  }
});

router.patch('/:id', httpAuth, async (req: Request, res: Response) => {
  try {
    const name = req.body.name;
    const id = req.params.id;

    if (typeof id !== 'string') {
      return res.status(500).json({ error: 'invalid id' });
    }
    let folder = await getFolder(id);
    if (folder.owner_id !== (req as any).user.id) {
      return res.status(401).json({ error: 'unauthorized' });
    }
    folder = await updateFolderName(name, id, (req as any).user.id);
    res.status(200).json({ folder });
  } catch (err) {
    res
      .status(500)
      .json({ error: 'there was an error updating the folder name' });
  }
});

router.delete('/:id', httpAuth, async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (typeof id !== 'string') {
      return res.status(500).json({ error: 'invalid id' });
    }
    const folder = await getFolder(id);
    if (folder.owner_id !== (req as any).user.id) {
      return res.status(401).json({ error: 'unauthorized' });
    }
    const result = await deleteFolder(id, (req as any).user.id);
    res.status(200).json({ result });
  } catch (err) {
    res.status(500).json({ error: 'there was an error deleting this folder' });
  }
});

export default router;
