import { ReactRenderer } from '@tiptap/react';
import type { SuggestionOptions } from '@tiptap/suggestion';

import type { Document } from '../lib/types';
import WikiLinkSuggestionList, {
  type WikiLinkSuggestionListRef,
} from '../components/WikiLinkSuggestionList';

export const wikiLinkSuggestion: Omit<SuggestionOptions<Document>, 'editor'> = {
  items: ({ query, editor }) => {
    const documents = editor.storage.wikilink.documents;

    if (!query) {
      return documents.slice(0, 10);
    }

    return documents
      .filter(document => document.title.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 10);
  },

  command: ({ editor, range, props }) => {
    editor
      .chain()
      .focus()
      .insertContentAt(range, [
        {
          type: 'wikilink',
          attrs: { documentId: props.id, label: props.title },
        },
        { type: 'text', text: ' ' },
      ])
      .run();
  },

  render: () => {
    let component: ReactRenderer<WikiLinkSuggestionListRef>;

    return {
      onStart: props => {
        component = new ReactRenderer(WikiLinkSuggestionList, {
          props,
          editor: props.editor,
        });

        if (!props.clientRect) {
          return;
        }

        document.body.appendChild(component.element);
        component.updateProps({ ...props, clientRect: props.clientRect });
        positionElement(component.element as HTMLElement, props.clientRect);
      },

      onUpdate: props => {
        component.updateProps(props);

        if (!props.clientRect) {
          return;
        }

        positionElement(component.element as HTMLElement, props.clientRect);
      },

      onKeyDown: props => {
        if (props.event.key === 'Escape') {
          component.destroy();
          component.element.remove();
          return true;
        }

        return component.ref?.onKeyDown(props) ?? false;
      },

      onExit: () => {
        component.destroy();
        component.element.remove();
      },
    };
  },
};

function positionElement(element: HTMLElement, clientRect: () => DOMRect | null) {
  const rect = clientRect();

  if (!rect) {
    return;
  }

  element.style.position = 'absolute';
  element.style.left = `${rect.left + window.scrollX}px`;
  element.style.top = `${rect.bottom + window.scrollY + 4}px`;
  element.style.zIndex = '50';
}
