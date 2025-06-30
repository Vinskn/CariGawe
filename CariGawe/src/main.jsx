import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import './index.css';
import App from './App.jsx';
import Home from './paging/Home.jsx';
import JobDetail from './paging/JobDetail.jsx';
import EmployeerPage from './paging/EmployeerPage.jsx';
import OnlineClass from './paging/OnlineClass.jsx';
import OnlineClassDetail from './paging/OnlineClassDetail.jsx';
import AdminPage from './paging/AdminPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { store } from './redux/store.js';
import Lowongan from './paging/jobs.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/home/detail/:id"
            element={
              <ProtectedRoute>
                <JobDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employeer"
            element={
              <ProtectedRoute allowedRoles={['perusahaan']}>
                <EmployeerPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/home/onlineclass"
            element={
              <ProtectedRoute allowedRoles={['pelamar', 'admin']}>
                <OnlineClass />
              </ProtectedRoute>
            }
          />
          <Route
            path="/home/onlineclass/detail/:id"
            element={
              <ProtectedRoute allowedRoles={['pelamar', 'admin']}>
                <OnlineClassDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/jobs"
            element={
              <ProtectedRoute allowedRoles={['pelamar']}>
                <Lowongan />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);