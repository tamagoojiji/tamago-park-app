import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ComingSoonPage from './pages/ComingSoonPage';
import PlanningPage from './pages/PlanningPage';
import ChecklistPage from './pages/ChecklistPage';
import GuidePage from './pages/GuidePage';
import EpGuidePage from './pages/EpGuidePage';
import RestaurantGuidePage from './pages/RestaurantGuidePage';
import PrivacyPage from './pages/PrivacyPage';
import WelcomePage from './pages/WelcomePage';
import ProfilePage from './pages/ProfilePage';
import HeightPage from './pages/HeightPage';
import { useAuth } from './contexts/AuthContext';

const FULLSCREEN_PATHS = ['/ep', '/restaurant'];

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token, user, isLoading } = useAuth();
  const location = useLocation();
  if (isLoading) return null;
  if (!token) {
    // ログイン後に戻れるようにパスを保存
    localStorage.setItem('tamago_park_redirect', location.pathname);
    return <Navigate to="/welcome" replace />;
  }
  // プロフィール未設定 → 初回のみプロフィール画面へ
  if (user && !user.birthday && !user.gender) {
    return <Navigate to="/profile" state={{ from: location.pathname }} replace />;
  }
  return <>{children}</>;
}

export default function App() {
  const location = useLocation();
  const { isLoading } = useAuth();

  const isFullscreen = FULLSCREEN_PATHS.includes(location.pathname);

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

  return (
    <>
      <Header />
      <Routes>
        {/* 公開ページ */}
        <Route path="/" element={<HomePage />} />
        <Route path="/guide" element={<GuidePage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/profile" element={<ProfilePage />} />

        {/* 保護ページ（ログイン必須） */}
        <Route path="/planning" element={<ProtectedRoute><PlanningPage /></ProtectedRoute>} />
        <Route path="/checklist" element={<ChecklistPage />} />

        <Route path="/height" element={<HeightPage />} />
        <Route path="/coming-soon" element={<ComingSoonPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
      <Footer />
    </>
  );
}
