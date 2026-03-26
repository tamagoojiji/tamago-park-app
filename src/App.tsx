import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ComingSoonPage from './pages/ComingSoonPage';
import GuidePage from './pages/GuidePage';
import EpGuidePage from './pages/EpGuidePage';
import RestaurantGuidePage from './pages/RestaurantGuidePage';
import PrivacyPage from './pages/PrivacyPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ResetPinPage from './pages/ResetPinPage';
import { useAuth } from './contexts/AuthContext';

const FULLSCREEN_PATHS = ['/ep', '/restaurant'];
const AUTH_PATHS = ['/login', '/register', '/reset-pin'];

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token, isLoading } = useAuth();
  if (isLoading) return null;
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  const location = useLocation();
  const isFullscreen = FULLSCREEN_PATHS.includes(location.pathname);
  const isAuthPage = AUTH_PATHS.includes(location.pathname);

  if (isFullscreen) {
    return (
      <Routes>
        <Route path="/ep" element={<EpGuidePage />} />
        <Route path="/restaurant" element={<RestaurantGuidePage />} />
      </Routes>
    );
  }

  return (
    <>
      <Header />
      <Routes>
        {/* 公開ページ */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/reset-pin" element={<ResetPinPage />} />
        <Route path="/guide" element={<GuidePage />} />
        <Route path="/privacy" element={<PrivacyPage />} />

        {/* 保護ページ（ログイン必須） */}
        <Route path="/planning" element={<ProtectedRoute><ComingSoonPage /></ProtectedRoute>} />
        <Route path="/checklist" element={<ProtectedRoute><ComingSoonPage /></ProtectedRoute>} />

        <Route path="/coming-soon" element={<ComingSoonPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
      {!isAuthPage && <Footer />}
    </>
  );
}
