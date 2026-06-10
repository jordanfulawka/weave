import { useEditorState } from '@tiptap/react';
import type { Editor } from '@tiptap/react';
import { useState } from 'react';
import { Bold, Italic, Minus, Plus } from 'lucide-react';

export function Toolbar({ editor }: { editor: Editor | null }) {
  const [fontSize, setFontSize] = useState(16);

  const editorState = useEditorState({
    editor,
    selector: (ctx) => {
      return {
        color: ctx.editor?.getAttributes('textStyle').color || '#221a16',
        isBold: ctx.editor?.isActive('bold') ?? false,
        isItalic: ctx.editor?.isActive('italic') ?? false,
      };
    },
  });

  if (!editor) return null;

  const buttonClass = (active: boolean) =>
    `p-2 rounded-md transition-colors ${active ? 'bg-surface-container-high text-primary' : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'}`;

  return (
    <div className='flex items-center gap-1 max-w-180 w-full mx-auto mb-3 px-2 py-1.5 bg-surface-container-lowest shadow-xl rounded-md'>
      <button
        type='button'
        className={buttonClass(editorState?.isBold ?? false)}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold size={16} strokeWidth={2} />
      </button>
      <button
        type='button'
        className={buttonClass(editorState?.isItalic ?? false)}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic size={16} strokeWidth={2} />
      </button>

      <div className='w-px h-6 bg-outline-variant' />
      <div className='flex items-center gap-0.5'>
        <button
          type='button'
          className={buttonClass(false)}
          onClick={() => {
            const newSize = fontSize - 1;
            setFontSize(newSize);
            editor.chain().focus().setFontSize(`${newSize}px`).run();
          }}
        >
          <Minus size={14} strokeWidth={2} />
        </button>
        <span className='text-sm text-on-surface w-10 text-center tabular-nums'>
          {fontSize}px
        </span>
        <button
          type='button'
          className={buttonClass(false)}
          onClick={() => {
            const newSize = fontSize + 1;
            setFontSize(newSize);
            editor.chain().focus().setFontSize(`${newSize}px`).run();
          }}
        >
          <Plus size={14} strokeWidth={2} />
        </button>
      </div>

      <div className='w-px h-6 bg-outline-variant mx-1' />
      <label className='relative w-7 h-7 rounded-full overflow-hidden border border-outline-variant cursor-pointer shrink-0'>
        <input
          type='color'
          onInput={(event) =>
            editor.chain().focus().setColor(event.currentTarget.value).run()
          }
          value={editorState?.color}
          data-testid='setColor'
          className='absolute -top-1 -left-1 w-9 h-9 cursor-pointer border-0 p-0'
        />
      </label>
    </div>
  );
}
