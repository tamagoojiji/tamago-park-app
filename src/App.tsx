import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ComingSoonPage from './pages/ComingSoonPage';
import GuidePage from './pages/GuidePage';

export default function App() {
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
