import { useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { FloatingMenu, BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCaret from '@tiptap/extension-collaboration-caret';
import { useHocuspocusProvider } from '@hocuspocus/provider-react';
import { useAuth } from '../contexts/AuthContext';
import { useDocuments } from '../contexts/DocumentsContext';
import WikiLink from '../extensions/WikiLink';
import { TextStyle, Color, FontSize } from '@tiptap/extension-text-style';
import { Toolbar } from './Toolbar';

function Editor() {
  const provider = useHocuspocusProvider();
  const { user } = useAuth();
  const { ownedDocs, sharedDocs, refreshGraph } = useDocuments();
  const debouncedRefresh = useRef<ReturnType<typeof setTimeout> | null>(null);

  const editor = useEditor(
    {
      extensions: [
        StarterKit,
        TextStyle,
        Color,
        FontSize,
        Collaboration.configure({ document: provider.document }),
        CollaborationCaret.configure({
          provider,
          user: { name: user?.username, color: '#904822' },
        }),
        WikiLink,
      ],
      onUpdate({ transaction }) {
        const hasLinkChange = transaction.steps.some((step) => {
          const json = step.toJSON();
          return JSON.stringify(json).includes('wikilink');
        });
        if (hasLinkChange) {
          if (debouncedRefresh.current) clearTimeout(debouncedRefresh.current);
          debouncedRefresh.current = setTimeout(() => {
            refreshGraph();
          }, 2000);
        }
      },
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
    <>
      <Toolbar editor={editor} />
      <div
        className='editor-content prose shadow-xl rounded-md bg-surface-container-lowest w-full flex-1'
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            editor?.commands.focus('end');
          }
        }}
      >
        <EditorContent editor={editor} />
        <FloatingMenu editor={editor} />
        <BubbleMenu editor={editor} />
      </div>
    </>
  );
}

export default Editor;
