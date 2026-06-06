import { BrowserRouter, Route, Routes } from 'react-router';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Doc from './pages/Doc';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/' element={<Home />} />
        <Route path='/doc/:docId' element={<Doc />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
