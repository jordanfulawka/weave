import { useParams } from 'react-router';
import Editor from '../components/Editor';
import { useAuth } from '../contexts/AuthContext';
import { HocuspocusRoom } from '@hocuspocus/provider-react';

export default function Doc() {
  const params = useParams();
  const { token } = useAuth();
  if (!params.docId) return null;
  if (!token) return null;
  return (
    <div>
      <HocuspocusRoom name={params.docId} token={token}>
        <Editor />
      </HocuspocusRoom>
    </div>
  );
}
