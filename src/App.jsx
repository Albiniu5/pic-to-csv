import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import HowItWorks from './pages/HowItWorks';
import UseCases from './pages/UseCases';
import EmailJSDebug from './pages/EmailJSDebug';
import Analytics from './components/Analytics';
import { HelmetProvider } from 'react-helmet-async';
import ImageToCsv from './pages/ImageToCsv';
import ImageToExcel from './pages/ImageToExcel';
import ExtractTableFromImage from './pages/ExtractTableFromImage';

function App() {
  // Client-side HTTP to HTTPS redirect
  React.useEffect(() => {
    if (window.location.protocol === 'http:' && window.location.hostname !== 'localhost') {
      window.location.href = window.location.href.replace('http:', 'https:');
    }
  }, []);

  return (
    <HelmetProvider>
      <BrowserRouter>
        <Analytics />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />

            {/* SEO Landing Pages */}
            <Route path="image-to-csv" element={<ImageToCsv />} />
            <Route path="image-to-excel" element={<ImageToExcel />} />
            <Route path="extract-table-from-image" element={<ExtractTableFromImage />} />

            <Route path="privacy" element={<PrivacyPolicy />} />
            <Route path="terms" element={<TermsOfService />} />
            <Route path="contact" element={<Contact />} />
            <Route path="faq" element={<FAQ />} />
            <Route path="how-it-works" element={<HowItWorks />} />
            <Route path="use-cases" element={<UseCases />} />
            <Route path="emailjs-debug" element={<EmailJSDebug />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
