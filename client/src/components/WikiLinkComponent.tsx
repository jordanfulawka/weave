import { Link } from 'react-router';
import { NodeViewWrapper, type NodeViewProps } from '@tiptap/react';

function WikiLinkComponent({ node }: NodeViewProps) {
  const { documentId, label } = node.attrs;

  return (
    <NodeViewWrapper as='span' className='wiki-link inline'>
      <Link
        to={`/doc/${documentId}`}
        contentEditable={false}
        data-type='wikilink'
        data-document-id={documentId}
        className='text-primary underline decoration-dotted'
      >
        {label ?? documentId}
      </Link>
    </NodeViewWrapper>
  );
}

export default WikiLinkComponent;
