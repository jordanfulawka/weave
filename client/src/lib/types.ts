interface User {
  id: string;
  username: string;
  email: string;
}

interface Document {
  id: string;
  owner_id: string;
  title: string;
  content_at: string;
  updated_at: string;
}

export type { User, Document };
