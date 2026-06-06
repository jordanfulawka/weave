import { BrowserRouter, Route, Routes } from 'react-router';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Doc from './pages/Doc';
import { AuthProvider } from './contexts/AuthContext';
import AppLayout from './layouts/AppLayout';
import Graph from './pages/Graph';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route element={<AppLayout />}>
            <Route path='/' element={<Home />} />
            <Route path='/doc/:docId' element={<Doc />} />
            <Route path='graph' element={<Graph />} />
          </Route>
          {/* <Route path='/' element={<Home />} />
          <Route path='/doc/:docId' element={<Doc />} /> */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
