import { Outlet } from 'react-router';
import Sidebar from '../components/Sidebar';

export default function AppLayout() {
  return (
    <div className='flex h-screen'>
      <div className='w-64'>
        <Sidebar />
      </div>
      <div className='flex-1'>
        <Outlet />
      </div>
    </div>
  );
}
