import { useEffect, useState } from 'react';
import { getGraphData } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import ForceGraph2D from 'react-force-graph-2d';
import { useNavigate } from 'react-router';

export default function Graph() {
  const [graphData, setGraphData] = useState<{ nodes: any[]; links: any[] }>({
    nodes: [],
    links: [],
  });
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchGraph() {
      console.log("tep')");
      if (!token) return;
      const apiGraphData = await getGraphData(token);
      console.log(apiGraphData);
      setGraphData(apiGraphData);
    }
    fetchGraph();
  }, [token]);

  function handleNodeClick(node) {
    console.log(node);
    // navigate(`/doc/${node.id}`);
  }

  return (
    <div className='flex flex-col h-full p-10'>
      <ForceGraph2D
        graphData={graphData}
        onNodeClick={handleNodeClick}
        width={1000}
        height={1000}
      />
    </div>
  );
}
