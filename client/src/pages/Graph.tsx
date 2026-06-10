import { useEffect, useRef, useState } from 'react';
import { getGraphData } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import ForceGraph2D from 'react-force-graph-2d';
import { useNavigate } from 'react-router';
import { useDocuments } from '../contexts/DocumentsContext';

export default function Graph() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [hoverNode, setHoverNode] = useState<any>(null);
  const [highlightNodes, setHighlightNodes] = useState(new Set());
  const [highlightLinks, setHighlightLinks] = useState(new Set());

  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<any>();

  const navigate = useNavigate();
  const { graphData } = useDocuments();

  const nodeColours = ['#6750A4', '#B58392', '#7D5260', '#625B71'];

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
    if (!graphRef.current) return;
    graphRef.current.d3Force('charge').strength(-20);
    graphRef.current.d3Force('link').distance(40);
  }, [graphData]);

  function handleNodeClick(node) {
    navigate(`/doc/${node.id}`);
  }

  function handleHoverNode(node) {
    const newHighlightNodes = new Set();
    const newHighlightLinks = new Set();

    if (node) {
      newHighlightNodes.add(node.id);
      graphData.links.forEach((link) => {
        const sourceId = link.source.id ?? link.source;
        const targetId = link.target.id ?? link.target;
        if (sourceId === node.id || targetId === node.id) {
          newHighlightLinks.add(`${sourceId}-${targetId}`);
          newHighlightNodes.add(sourceId);
          newHighlightNodes.add(targetId);
        }
      });
    }

    setHoverNode(node);
    setHighlightLinks(newHighlightLinks);
    setHighlightNodes(newHighlightNodes);
  }

  return (
    <div ref={containerRef} className='h-full w-full'>
      <ForceGraph2D
        ref={graphRef}
        graphData={graphData}
        nodeRelSize={10}
        linkWidth={5}
        onNodeClick={handleNodeClick}
        width={dimensions.width}
        height={dimensions.height}
        nodeColor={(node) => {
          if (highlightNodes.size > 0 && !highlightNodes.has(node.id)) {
            return '#D9D3D0';
          }
          return nodeColours[node.id.charCodeAt(6) % nodeColours.length];
        }}
        linkColor={(link) => {
          const sourceId = link.source.id ?? link.source;
          const targetId = link.target.id ?? link.target;
          const linkKey = `${sourceId}-${targetId}`;
          if (highlightNodes.size > 0 && !highlightLinks.has(linkKey)) {
            return 'rgba(34, 26, 22, 0.08)';
          }
          return nodeColours[
            link.source.id?.charCodeAt(0) % nodeColours.length
          ];
        }}
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
        nodeLabel={(node) => node.title}
        linkDirectionalParticles={3}
        linkDirectionalParticleWidth={10}
        linkDirectionalParticleColor={(link) => {
          const sourceId = link.source.id ?? link.source;
          const targetId = link.target.id ?? link.target;
          const linkKey = `${sourceId}-${targetId}`;
          if (highlightNodes.size > 0 && !highlightLinks.has(linkKey)) {
            return 'rgba(34,26,22,0.08)';
          }

          return nodeColours[
            link.source.id?.charCodeAt(4) % nodeColours.length
          ];
        }}
        linkCurvature={0.2}
        onNodeHover={handleHoverNode}
      />
    </div>
  );
}
