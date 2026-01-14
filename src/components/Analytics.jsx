import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const GA_MEASUREMENT_ID = import.meta.env.VITE_GOOGLE_ANALYTICS_ID;

export default function Analytics() {
    const location = useLocation();

    useEffect(() => {
        if (!GA_MEASUREMENT_ID) {
            console.warn("Analytics: No Measurement ID found. Check VITE_GOOGLE_ANALYTICS_ID.");
            return;
        }

        console.log("Analytics: Initializing with ID", GA_MEASUREMENT_ID);

        // Initialize GA4 only once
        if (!window.dataLayer) {
            const script = document.createElement('script');
            script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
            script.async = true;
            document.head.appendChild(script);

            window.dataLayer = window.dataLayer || [];
            function gtag() { window.dataLayer.push(arguments); }
            gtag('js', new Date());
            gtag('config', GA_MEASUREMENT_ID);
            window.gtag = gtag;
        }
    }, []);

    useEffect(() => {
        if (!GA_MEASUREMENT_ID || !window.gtag) return;

        // Track page view on route change
        window.gtag('event', 'page_view', {
            page_path: location.pathname + location.search,
            page_title: document.title
        });
    }, [location]);

    return null;
}
