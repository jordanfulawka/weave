import { useEffect, useRef, useState } from 'react';
import { getGraphData } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import ForceGraph2D from 'react-force-graph-2d';
import { useNavigate } from 'react-router';
import { useDocuments } from '../contexts/DocumentsContext';

export default function Graph() {

  const { token } = useAuth();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const { ownedDocs, sharedDocs } = useDocuments();

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(([entry]) => {
      setDimensions({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      });
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    async function fetchGraph() {
      if (!token) return;
      const apiGraphData = await getGraphData(token);
      setGraphData(apiGraphData);
    }
    fetchGraph();
  }, [token, ownedDocs.length, sharedDocs.length]);

  function handleNodeClick(node) {
    console.log(node);
    navigate(`/doc/${node.id}`);
  }

  return (
    <div ref={containerRef} className='h-full w-full'>
      <ForceGraph2D
        graphData={graphData}
        onNodeClick={handleNodeClick}
        width={dimensions.width}
        height={dimensions.height}
      />
    </div>
  );
}
