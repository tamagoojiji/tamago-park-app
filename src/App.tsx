import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ComingSoonPage from './pages/ComingSoonPage';
import GuidePage from './pages/GuidePage';
import EpGuidePage from './pages/EpGuidePage';
import RestaurantGuidePage from './pages/RestaurantGuidePage';
import PrivacyPage from './pages/PrivacyPage';
import WelcomePage from './pages/WelcomePage';
import { useAuth } from './contexts/AuthContext';

const FULLSCREEN_PATHS = ['/ep', '/restaurant'];

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token, isLoading } = useAuth();
  if (isLoading) return null;
  if (!token) return <Navigate to="/welcome" replace />;
  return <>{children}</>;
}

export default function App() {
  const location = useLocation();
  const { token, isGuest, isLoading } = useAuth();

  const isFullscreen = FULLSCREEN_PATHS.includes(location.pathname);

  // ウェルカム画面: 毎回表示（トークンもゲストモードもない場合）
  const showWelcome = !token && !isGuest && !isLoading && location.pathname !== '/privacy';

  if (isFullscreen) {
    return (
      <Routes>
        <Route path="/ep" element={<EpGuidePage />} />
        <Route path="/restaurant" element={<RestaurantGuidePage />} />
      </Routes>
    );
  }

  if (showWelcome) {
    return <WelcomePage />;
  }

  if (isLoading) return null;

  return (
    <>
      <Header />
      <Routes>
        {/* 公開ページ */}
        <Route path="/" element={<HomePage />} />
        <Route path="/guide" element={<GuidePage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/welcome" element={<WelcomePage />} />

        {/* 保護ページ（ログイン必須） */}
        <Route path="/planning" element={<ProtectedRoute><ComingSoonPage /></ProtectedRoute>} />
        <Route path="/checklist" element={<ProtectedRoute><ComingSoonPage /></ProtectedRoute>} />

        <Route path="/coming-soon" element={<ComingSoonPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
      <Footer />
    </>
  );
}
