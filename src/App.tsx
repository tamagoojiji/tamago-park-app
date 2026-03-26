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

  if (isLoading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #4A90D9 0%, #6FB3F2 50%, #87CEEB 100%)',
        color: '#fff', fontFamily: 'var(--font-main)', fontSize: '16px',
      }}>
        読み込み中...
      </div>
    );
  }

  if (showWelcome) {
    return <WelcomePage />;
  }

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
