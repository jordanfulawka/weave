import { useParams } from 'react-router';

export default function Doc() {
  const params = useParams();
  return <div>doc: {params.docId}</div>;
}
