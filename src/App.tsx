import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ComingSoonPage from './pages/ComingSoonPage';
import GuidePage from './pages/GuidePage';
import EpGuidePage from './pages/EpGuidePage';
import RestaurantGuidePage from './pages/RestaurantGuidePage';

const FULLSCREEN_PATHS = ['/ep', '/restaurant'];

export default function App() {
  const location = useLocation();
  const isFullscreen = FULLSCREEN_PATHS.includes(location.pathname);

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
        <Route path="/" element={<HomePage />} />
        <Route path="/coming-soon" element={<ComingSoonPage />} />
        <Route path="/guide" element={<GuidePage />} />
        {/* 機能解放時にルートを追加 */}
        <Route path="*" element={<HomePage />} />
      </Routes>
      <Footer />
    </>
  );
}
