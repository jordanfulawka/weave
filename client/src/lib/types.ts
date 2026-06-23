interface User {
  id: string;
  username: string;
  email: string;
}

interface Document {
  id: string;
  owner_id: string;
  title: string;
  folder_id: string | null;
  content_at: string;
  updated_at: string;
}

interface Folder {
  id: string;
  owner_id: string;
  name: string;
  created_at: string;
}

export type { User, Document, Folder };
