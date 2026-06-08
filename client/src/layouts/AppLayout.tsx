import { Outlet } from 'react-router';
import Sidebar from '../components/Sidebar';
import { HocuspocusProviderWebsocketComponent } from '@hocuspocus/provider-react';
import { DocumentsProvider } from '../contexts/DocumentsContext';

export default function AppLayout() {
  return (
    <DocumentsProvider>
      <div className='flex h-screen'>
        <div className='w-64'>
          <Sidebar />
        </div>
        <div className='flex-1'>
          <HocuspocusProviderWebsocketComponent
            url={import.meta.env.VITE_WS_URL}
          >
            <Outlet />
          </HocuspocusProviderWebsocketComponent>
        </div>
      </div>
    </DocumentsProvider>
  );
}
