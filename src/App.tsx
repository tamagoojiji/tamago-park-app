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
import PlanningPortalPage from './pages/survey/PlanningPortalPage';
import SurveyPage from './pages/survey/SurveyPage';
import SurveyCompletePage from './pages/survey/SurveyCompletePage';
import MyPlanPage from './pages/myplan/MyPlanPage';
import MyPlanHistoryPage from './pages/myplan/MyPlanHistoryPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminSurveysPage from './pages/admin/AdminSurveysPage';
import AdminShowsPage from './pages/admin/AdminShowsPage';
import AdminEventsPage from './pages/admin/AdminEventsPage';
import AdminStatsPage from './pages/admin/AdminStatsPage';
import AdminShopCoordinatesPage from './pages/admin/AdminShopCoordinatesPage';
import AdminLayout from './components/admin/AdminLayout';
import { hasAdminToken } from './api/admin';
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

function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  if (!hasAdminToken()) {
    return <Navigate to="/admin" replace />;
  }
  return <>{children}</>;
}

export default function App() {
  const location = useLocation();
  const { isLoading } = useAuth();

  const isFullscreen = FULLSCREEN_PATHS.includes(location.pathname);
  const isAdmin = location.pathname.startsWith('/admin');

  if (isAdmin) {
    return (
      <Routes>
        <Route path="/admin" element={<AdminLoginPage />} />
        <Route element={<AdminProtectedRoute><AdminLayout /></AdminProtectedRoute>}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/surveys" element={<AdminSurveysPage />} />
          <Route path="/admin/shows" element={<AdminShowsPage />} />
          <Route path="/admin/events" element={<AdminEventsPage />} />
          <Route path="/admin/stats" element={<AdminStatsPage />} />
          <Route path="/admin/shop-coordinates" element={<AdminShopCoordinatesPage />} />
        </Route>
      </Routes>
    );
  }

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
        <Route path="/survey" element={<ProtectedRoute><PlanningPortalPage /></ProtectedRoute>} />
        <Route path="/survey/form" element={<ProtectedRoute><SurveyPage /></ProtectedRoute>} />
        <Route path="/survey/complete" element={<ProtectedRoute><SurveyCompletePage /></ProtectedRoute>} />
        <Route path="/planning" element={<ProtectedRoute><PlanningPage /></ProtectedRoute>} />
        <Route path="/myplan" element={<ProtectedRoute><MyPlanPage /></ProtectedRoute>} />
        <Route path="/myplan/history" element={<ProtectedRoute><MyPlanHistoryPage /></ProtectedRoute>} />
        <Route path="/checklist" element={<ChecklistPage />} />

        <Route path="/height" element={<HeightPage />} />
        <Route path="/coming-soon" element={<ComingSoonPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
      <Footer />
    </>
  );
}
