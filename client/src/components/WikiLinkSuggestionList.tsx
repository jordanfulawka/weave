import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import type { SuggestionKeyDownProps, SuggestionProps } from '@tiptap/suggestion';

import type { Document } from '../lib/types';

export interface WikiLinkSuggestionListRef {
  onKeyDown: (props: SuggestionKeyDownProps) => boolean;
}

const WikiLinkSuggestionList = forwardRef<WikiLinkSuggestionListRef, SuggestionProps<Document>>(
  ({ items, command }, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    useEffect(() => {
      setSelectedIndex(0);
    }, [items]);

    const selectItem = (index: number) => {
      const item = items[index];

      if (item) {
        command({ id: item.id, title: item.title });
      }
    };

    useImperativeHandle(ref, () => ({
      onKeyDown: ({ event }) => {
        if (event.key === 'ArrowUp') {
          setSelectedIndex((selectedIndex + items.length - 1) % items.length);
          return true;
        }

        if (event.key === 'ArrowDown') {
          setSelectedIndex((selectedIndex + 1) % items.length);
          return true;
        }

        if (event.key === 'Enter') {
          selectItem(selectedIndex);
          return true;
        }

        return false;
      },
    }));

    if (items.length === 0) {
      return (
        <div className='wiki-link-suggestion-list rounded-md bg-surface-container shadow-lg p-2 text-sm text-on-surface-variant'>
          No documents found
        </div>
      );
    }

    return (
      <div className='wiki-link-suggestion-list rounded-md bg-surface-container shadow-lg py-1 min-w-50'>
        {items.map((item, index) => (
          <button
            key={item.id}
            type='button'
            onClick={() => selectItem(index)}
            className={`w-full text-left px-3 py-1.5 text-sm ${
              index === selectedIndex ? 'bg-surface-container-high' : ''
            }`}
          >
            {item.title}
          </button>
        ))}
      </div>
    );
  },
);

WikiLinkSuggestionList.displayName = 'WikiLinkSuggestionList';

export default WikiLinkSuggestionList;
