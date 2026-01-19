```javascript
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

function App() {
  return (
    <BrowserRouter>
      <Analytics />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="privacy" element={<PrivacyPolicy />} />
          <Route path="terms" element={<TermsOfService />} />
          <Route path="contact" element={<Contact />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="how-it-works" element={<HowItWorks />} />
          <Route path="use-cases" element={<UseCases />} />
          <Route path="/emailjs-debug" element={<EmailJSDebug />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
