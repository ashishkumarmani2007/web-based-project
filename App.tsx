import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { I18nProvider } from './i18n';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Landing } from './pages/Landing';
import { Demo } from './pages/Demo';
import { HowItWorks } from './pages/HowItWorks';
import { Privacy } from './pages/Privacy';
import { About } from './pages/About';
import { Alerts } from './pages/Alerts';
export const App: React.FC = () => {
  return (
    <I18nProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-vsBg text-vsText font-sans selection:bg-vsBlue selection:text-white">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/demo" element={<Demo />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/about" element={<About />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="*" element={<Landing />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </I18nProvider>
  );
};
export default App;
