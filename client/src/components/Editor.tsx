import { useEditor, EditorContent } from '@tiptap/react';
import { FloatingMenu, BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import Collaboration from '@tiptap/extension-collaboration';
import { useHocuspocusProvider } from '@hocuspocus/provider-react';

function Editor() {
  const provider = useHocuspocusProvider();

  const editor = useEditor(
    {
      extensions: [
        StarterKit,
        Collaboration.configure({ document: provider.document }),
      ],
    },
    [provider.document],
  );

  return (
    <>
      <EditorContent editor={editor} />
      <FloatingMenu editor={editor} />
      <BubbleMenu editor={editor} />
    </>
  );
}

export default Editor;
