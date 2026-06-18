# Weave

_A real-time collaborative notes app with Google-Docs style multi-user editing (React, Tiptap, Yjs/Hocuspocus) and an interactive graph view for navigating linked documents, backed by Express and PostgreSQL_

  <p align="center">
    <a href="https://fitcheck-v2.vercel.app/">Live </a>
    &middot;
    <a href="https://github.com/jordanfulawka/weave/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    &middot;
    <a href="https://github.com/jordanfulawka/weave/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>

Note-taking apps like Notion or Google are great for writing, but they treat each document as an island - connections between the notes live solely in your head, not in the tool. When you're trying to build a personal knowledge base, you end up either over-organizing into folders that don't capture how ideas actually relate, or just losing track of what links to what. I built Weave to solve this for myself: a real-time collaborative notes app where documents can reference eachother directly, and you can see the resulting web of connections, not just a flat list. It's built with React, Tiptap, Yjs (via Hocuspocus) for conflict-free real-time editing, with an Express and PostgreSQL backend handling auth, document storage, and sharing. In its current state, Weave comes with the following features:

- Real-Time Collaborative Editing - Multiple users can edit the same document simultaneously with live cursors and presence, powered by Yjs CRDTs and Hocuspocus for conflict-free sync
- Wiki-Style Linking - Type [[ inside of a document to search for and link to another doc inline, turning your notes into a connected knowledge base instead of isolated pages
- Interactive Graph View - Visualize how your documents link to one another as an explorable force-directed graph (react-force-graph), making it easy to spot clusters and orphaned notes
- Document Sharing - Share individual documents with other users so they can view or collaborate on them in real time
- Server Authentication - JWT-based auth with protected routes on both client and server, keeping each user's documents private by defaultmaybe sha

## Built With

### Frontend (client)

- React 19 + Vite - UI and build tooling
- TypeScript
- Tiptap - rich text editor framework
- Yjs - CRDT for real-time collaborative state
- Hocuspocus (provider + provider-react) - Yjs sync provider/transport
- React Router
- Tailwind CSS
- react-force-graph - interactive graph view for linked documents
- Lucide - icons

### Backend (server)

- Node.js + Express 5
- TypeScript
- Hocuspocus Server
- PostgreSQL
- JSON Web Tokens - authentication
- bcrypt.js - password hashing

### Infrastructure

- Docker Compose - PostgreSQL service orchestration for local dev

## Getting Started

#### Prerequisites

- Node.js (v20+ recommended)
- Docker (for running PostgreSQL locally)

#### Installation

1. Clone this repo
2. Start PostgreSQL  
   `docker compose up -d`  
   This spins up a Postgres instance on localhost:5432 and seeds it with the schems in `server/src/db/init.sql`
3. Set up the server  
    `cd server`  
    `npm install`  
    Create a .env file in server with:  
   `DATABASE_URL=postgresql://weave:weave@localhost:5432/weave`  
   `JWT_SECRET=your_jwt_secret`  
   `PORT=3001`  
   Then start it with:  
   `npm run dev`
4. Set up the client  
   `cd ../client`  
   `npm install`  
   Create a .env file in client/ with:  
   `VITE_API_URL=http://localhost:3001`  
   `VITE_WS_URL=ws://localhost:3001`  
   Then start it with:  
   `npm run dev`
5. Open the app at the URL Vite prints (typically http://localhost:5173)

## Roadmap

#### Organization

- [ ] Folders/nested workspaces for grouping documents
- [ ] Tags, in addition to folders, for cross-cutting organization
- [ ] Full text-search across all documents

#### Collaboration & Permissions

- [ ] Granular permission levels (viewer, editor, owner) per document, not just owner-or-shared
- [ ] Sharable public read-only links (no login required)
- [x] "Who's online" presence list beyond just live cursors

#### History & Resilience

- [ ] Version history / time-travel, leveraging Yjs's CRDT history rather than building a separate audit log
- [ ] Offlien editing support via local Yjs persistence (IndexedDB) that syncs once reconnected

#### Polish

- [ ] Markdown / PDF export
- [ ] Document templates for new notes
- [ ] Dark mode variant of the "cozy reading room" theme

## Contact

Jordan Fulawka - [jordan.fulawka@outlook.com](mailto:jordan.fulawka@outlook.com)

Portfolio - [jordanfulawka.ca](https://jordanfulawka.ca)

LinkedIn: [linkedin.com/in/jordan-fulawka](https://www.linkedin.com/in/jordanfulawka/)

GitHub: [@jordanfulawka](https://github.com/jordanfulawka)

Project Link: [github.com/jordanfulawka/fitcheck-v2](https://github.com/jordanfulawka/weave)
