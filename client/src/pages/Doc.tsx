import { useParams } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { HocuspocusRoom } from '@hocuspocus/provider-react';
import DocWorkspace from '../components/DocWorkspace';

export default function Doc() {
  const { token } = useAuth();
  const params = useParams();

  if (!params.docId) return null;
  if (!token) return null;

  return (
    <HocuspocusRoom name={params.docId} token={token}>
      <DocWorkspace />
    </HocuspocusRoom>
  );
}
