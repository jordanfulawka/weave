import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { FloatingMenu, BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCaret from '@tiptap/extension-collaboration-caret';
import { useHocuspocusProvider } from '@hocuspocus/provider-react';
import { useAuth } from '../contexts/AuthContext';
import { useDocuments } from '../contexts/DocumentsContext';
import WikiLink from '../extensions/WikiLink';

function Editor() {
  const provider = useHocuspocusProvider();
  const { user } = useAuth();
  const { ownedDocs, sharedDocs } = useDocuments();

  const editor = useEditor(
    {
      extensions: [
        StarterKit,
        Collaboration.configure({ document: provider.document }),
        CollaborationCaret.configure({
          provider,
          user: { name: user?.username, color: '#904822' },
        }),
        WikiLink,
      ],
    },
    [provider.document],
  );

  useEffect(() => {
    if (!editor) {
      return;
    }

    editor.commands.setWikiLinkDocuments([...ownedDocs, ...sharedDocs]);
  }, [editor, ownedDocs, sharedDocs]);

  return (
    <div className='editor-content prose shadow-xl rounded-md bg-surface-container-lowest w-full flex-1'>
      <EditorContent editor={editor} />
      <FloatingMenu editor={editor} />
      <BubbleMenu editor={editor} />
    </div>
  );
}

export default Editor;
