import { useEffect, useRef, useState } from 'react';
import { useDocuments } from '../contexts/DocumentsContext';
import ForceGraph2D from 'react-force-graph-2d';
import { Link, useNavigate, useParams } from 'react-router';
import { FileText } from 'lucide-react';

export function Linkbar() {
  const { graphData } = useDocuments();
  const graphRef = useRef<any>(null);
  const graphContainerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [links, setLinks] = useState<any[]>([]);
  const [backlinks, setBacklinks] = useState<any[]>([]);
  const params = useParams();
  const navigate = useNavigate();

  const nodeColours = ['#6750A4', '#B58392', '#7D5260', '#625B71'];

  useEffect(() => {
    if (!graphRef.current) return;

    setTimeout(() => {
      const node = graphData.nodes.find((node) => node.id === params.docId);
      if (node && graphRef.current) {
        graphRef.current.centerAt(node.x, node.y, 400);
        graphRef.current.zoom(1.5, 400);
      }
    }, 750);
  }, [graphData, params.docId]);

  useEffect(() => {
    if (!graphContainerRef.current) return;

    const observer = new ResizeObserver(([entry]) => {
      setDimensions({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      });
    });
    observer.observe(graphContainerRef.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const getId = (node: any) => (typeof node === 'object' ? node.id : node);

    const linkDocs = graphData.links
      .filter((link) => getId(link.source) === params.docId)
      .map((link) =>
        graphData.nodes.find((node) => node.id === getId(link.target)),
      );

    const backlinkDocs = graphData.links
      .filter((link) => getId(link.target) === params.docId)
      .map((link) =>
        graphData.nodes.find((node) => node.id === getId(link.source)),
      );
    setLinks(linkDocs);
    setBacklinks(backlinkDocs);
  }, [graphData, params.docId]);

  useEffect(() => {
    if (!graphRef.current) return;
    graphRef.current.d3Force('charge').strength(-10);
    graphRef.current.d3Force('link').distance(50);
  }, [graphData]);

  function handleNodeClick(node: any) {
    navigate(`/doc/${node.id}`);
  }

  return (
    <div className='bg-surface-container-lowest h-full flex flex-col'>
      <div className='max-h-[50%] overflow-y-auto'>
        <h2 className='font-semibold text-on-surface px-3 pt-4'>Connections</h2>

        <h3 className='text-xs uppercase tracking-widest text-on-surface px-3 mt-5 mb-1 border-l-2 border-primary pl-2'>
          Links
        </h3>
        {links.length > 0 ? (
          links.map((doc) => {
            return (
              <Link key={doc.id} to={`/doc/${doc.id}`}>
                <div
                  key={doc.id}
                  className='flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-surface-container cursor-pointer text-sm text-on-surface'
                >
                  <FileText
                    size={13}
                    className='text-on-surface-variant shrink-0'
                  />
                  <span className='truncate'>{doc.title}</span>
                </div>
              </Link>
            );
          })
        ) : (
          <p className='px-3 py-1.5 text-sm text-on-surface-variant italic'>
            This note doesn't link to anything
          </p>
        )}
        <h3 className='text-xs uppercase tracking-widest text-on-surface px-3 mt-5 mb-1 border-l-2 border-primary pl-2'>
          Backlinks
        </h3>
        {backlinks.length > 0 ? (
          backlinks.map((doc) => {
            return (
              <Link key={doc.id} to={`/doc/${doc.id}`}>
                <div className='flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-surface-container cursor-pointer text-sm text-on-surface'>
                  <FileText
                    size={13}
                    className='text-on-surface-variant shrink-0'
                  />
                  <span className='truncate'>{doc.title}</span>
                </div>
              </Link>
            );
          })
        ) : (
          <p className='px-3 py-1.5 text-sm text-on-surface-variant italic'>
            Nothing links to this note
          </p>
        )}
      </div>
      <div className='flex flex-col flex-1 min-h-0'>
        <h2 className='font-semibold text-on-surface px-3 pt-5'>Graph View</h2>

        <div className='flex-1 min-h-0 p-5'>
          <div
            ref={graphContainerRef}
            className='bg-[#fef5f0] shadow-sm h-full w-full rounded-lg border border-outline-variant relative'
          >
            <ForceGraph2D
              ref={graphRef}
              graphData={graphData}
              nodeRelSize={10}
              width={dimensions.width}
              height={dimensions.height}
              nodeColor={(node) =>
                nodeColours[node.id.charCodeAt(6) % nodeColours.length]
              }
              linkWidth={5}
              linkColor={(link) =>
                nodeColours[link.source.id?.charCodeAt(0) % nodeColours.length]
              }
              nodeVal={(node) => {
                const degree = graphData.links.filter(
                  (link) =>
                    link.source === node.id ||
                    link.target === node.id ||
                    link.source.id === node.id ||
                    link.target.id === node.id,
                ).length;
                return Math.max(1, degree);
              }}
              onNodeClick={(node) => handleNodeClick(node)}
            />
            <button
              className='absolute bottom-4 left-1/2 -translate-x-1/2 bg-surface-container-lowest p-2 rounded-xl border border-outline-variant shadow-xl cursor-pointer hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-200'
              onClick={() => navigate('/graph')}
            >
              Extend Graph
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Linkbar;
