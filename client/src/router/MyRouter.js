import { Routes, Route, Navigate } from 'react-router-dom';

import Login from '../pages/Login/Login';
import Home from '../pages/Home/Home';
import Type from '../pages/Type/Type';
import Progress from '../pages/Progress/Progress';
import ProtectedRoutes from './ProtectedRoutes';
import OpenRoutes from './OpenRoutes';

function MyRouter() {
  return (
    <Routes>
      <Route element={<OpenRoutes />}>
        <Route path="/login" element={<Login />} />
      </Route>

      <Route element={<ProtectedRoutes />}>
        <Route path="/" element={<Home />} />
        <Route path="/type" element={<Type />} />
        <Route path="/progress" element={<Progress />} />
      </Route>
    </Routes>
  )
}

export default MyRouter;