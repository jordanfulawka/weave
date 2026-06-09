import { Outlet } from 'react-router';
import Sidebar from '../components/Sidebar';
import { HocuspocusProviderWebsocketComponent } from '@hocuspocus/provider-react';
import { DocumentsProvider } from '../contexts/DocumentsContext';
import Linkbar from '../components/Linkbar';

export default function AppLayout() {
  return (
    <DocumentsProvider>
      <div className='flex h-screen'>
        <div className='w-70'>
          <Sidebar />
        </div>
        <div className='flex-1'>
          <HocuspocusProviderWebsocketComponent
            url={import.meta.env.VITE_WS_URL}
          >
            <Outlet />
          </HocuspocusProviderWebsocketComponent>
        </div>
        <div className='w-70 h-full'>
          <Linkbar />
        </div>
      </div>
    </DocumentsProvider>
  );
}
