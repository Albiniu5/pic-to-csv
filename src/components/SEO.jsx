import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function SEO({ title, description, canonical, type = 'website', name = 'PicToCSV' }) {
    const siteUrl = 'https://pictocsv.com';
    const fullCanonical = canonical ? `${siteUrl}${canonical}` : siteUrl;

    return (
        <Helmet>
            {/* Standard Metadata */}
            <title>{title}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={fullCanonical} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={fullCanonical} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:site_name" content={name} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={fullCanonical} />
            <meta property="twitter:title" content={title} />
            <meta property="twitter:description" content={description} />
        </Helmet>
    );
}
