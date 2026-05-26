import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { MusicProvider } from './context/MusicContext';
import SakuraPetals from './components/SakuraPetals';
import AmbientParticles from './components/AmbientParticles';
import CinematicBackground from './components/CinematicBackground';
import MiniPlayer from './components/MiniPlayer';
import HomePage from './pages/HomePage';
import PuzzlePage from './pages/PuzzlePage';
import GalleryPage from './pages/GalleryPage';
import MusicPage from './pages/MusicPage';
import NotesPage from './pages/NotesPage';
import VoicePage from './pages/VoicePage';

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/puzzle" element={<PuzzlePage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/music" element={<MusicPage />} />
        <Route path="/notes" element={<NotesPage />} />
        <Route path="/voice" element={<VoicePage />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <MusicProvider>
      <BrowserRouter>
        <CinematicBackground />
        <AmbientParticles />
        <SakuraPetals />
        <div className="relative z-20 min-h-screen overflow-x-hidden">
          <AnimatedRoutes />
        </div>
        <MiniPlayer />
      </BrowserRouter>
    </MusicProvider>
  );
}
