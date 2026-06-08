/* eslint-disable @typescript-eslint/no-explicit-any */
import { mergeAttributes, Node } from '@tiptap/core';
import { Node as ProseMirrorNode, type DOMOutputSpec } from '@tiptap/pm/model';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { Suggestion, type SuggestionOptions } from '@tiptap/suggestion';

import WikiLinkComponent from '../components/WikiLinkComponent';
import { wikiLinkSuggestion } from './wikiLinkSuggestion';
import type { Document } from '../lib/types';

export interface WikiLinkStorage {
  documents: Document[];
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    wikilink: {
      setWikiLinkDocuments: (documents: Document[]) => ReturnType;
    };
  }
}

export interface WikiLinkNodeAttrs {
  documentId: string | null;
  label?: string | null;
}

export interface WikiLinkOptions<
  SuggestionItem = any,
  Attrs extends Record<string, any> = WikiLinkNodeAttrs,
> {
  HTMLAttributes: Record<string, any>;

  renderText: (props: {
    options: WikiLinkOptions<SuggestionItem, Attrs>;
    node: ProseMirrorNode;
  }) => string;

  renderHTML: (props: {
    options: WikiLinkOptions<SuggestionItem, Attrs>;
    node: ProseMirrorNode;
  }) => DOMOutputSpec;

  deleteTriggerWithBackspace: boolean;

  suggestion: Omit<SuggestionOptions<SuggestionItem, Attrs>, 'editor'>;
}

export const WikiLink = Node.create<WikiLinkOptions, WikiLinkStorage>({
  name: 'wikilink',

  priority: 101,

  addStorage() {
    return {
      documents: [],
    };
  },

  addOptions() {
    return {
      HTMLAttributes: {},
      renderText({ node }) {
        return `[[${node.attrs.label ?? node.attrs.documentId}]]`;
      },
      renderHTML({ options, node }) {
        return [
          'a',
          mergeAttributes(options.HTMLAttributes, {
            'data-type': 'wikilink',
            'data-document-id': node.attrs.documentId,
            href: `/doc/${node.attrs.documentId}`,
          }),
          node.attrs.label ?? node.attrs.documentId,
        ];
      },
      deleteTriggerWithBackspace: false,
      suggestion: wikiLinkSuggestion,
    };
  },

  group: 'inline',

  inline: true,

  selectable: false,

  atom: true,

  addAttributes() {
    return {
      documentId: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-document-id'),
        renderHTML: (attributes) => {
          if (!attributes.documentId) {
            return {};
          }

          return {
            'data-document-id': attributes.documentId,
          };
        },
      },

      label: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-label'),
        renderHTML: (attributes) => {
          if (!attributes.label) {
            return {};
          }

          return {
            'data-label': attributes.label,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: `a[data-type="${this.name}"]`,
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    return this.options.renderHTML({
      options: {
        ...this.options,
        HTMLAttributes: mergeAttributes(
          this.options.HTMLAttributes,
          HTMLAttributes,
        ),
      },
      node,
    });
  },

  renderText({ node }) {
    return this.options.renderText({ options: this.options, node });
  },

  addNodeView() {
    return ReactNodeViewRenderer(WikiLinkComponent);
  },

  addCommands() {
    return {
      setWikiLinkDocuments:
        (documents: Document[]) =>
        () => {
          this.storage.documents = documents;
          return true;
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      Backspace: () =>
        this.editor.commands.command(({ tr, state }) => {
          let isWikiLink = false;
          const { selection } = state;
          const { empty, anchor } = selection;

          if (!empty) {
            return false;
          }

          let wikiLinkNode = new ProseMirrorNode();
          let wikiLinkPos = 0;

          state.doc.nodesBetween(anchor - 1, anchor, (node, pos) => {
            if (node.type.name === this.name) {
              isWikiLink = true;
              wikiLinkNode = node;
              wikiLinkPos = pos;
              return false;
            }
          });

          if (isWikiLink) {
            tr.insertText(
              this.options.deleteTriggerWithBackspace ? '' : '[[',
              wikiLinkPos,
              wikiLinkPos + wikiLinkNode.nodeSize,
            );
          }

          return isWikiLink;
        }),
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        ...this.options.suggestion,
        editor: this.editor,
        char: '[[',
      }),
    ];
  },
});

export default WikiLink;
