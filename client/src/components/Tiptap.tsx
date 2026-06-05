// src/Tiptap.tsx
import { useEditor, EditorContent } from '@tiptap/react';
import { FloatingMenu, BubbleMenu } from '@tiptap/react/menus';
import * as Y from 'yjs';
import StarterKit from '@tiptap/starter-kit';
import Collaboration from '@tiptap/extension-collaboration';
import { HocuspocusProvider } from '@hocuspocus/provider';

function Tiptap() {
  const doc = new Y.Doc();

  const provider = new HocuspocusProvider({
    url: 'ws://127.0.0.1:1234',
    name: 'example document',
    document: doc,
  });

  provider.on('synced', () => {
    console.log('hello');
  });

  const editor = useEditor({
    extensions: [StarterKit, Collaboration.configure({ document: doc })],
    content: '<p>hello world</p>',
  });

  return (
    <>
      <EditorContent editor={editor} />
      <FloatingMenu editor={editor} />
      <BubbleMenu editor={editor} />
    </>
  );
}

export default Tiptap;
