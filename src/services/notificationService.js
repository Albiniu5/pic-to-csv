// Notification service for owner alerts on conversion/download

const OWNER_EMAIL = 'owner@pictocsv.com'; // Replace with actual owner email
const WEBHOOK_URL = import.meta.env.VITE_NOTIFICATION_WEBHOOK_URL || null;

/**
 * Send notification to owner when file is converted
 */
export const notifyOwnerConversion = async (fileInfo) => {
    const notification = {
        type: 'conversion',
        timestamp: new Date().toISOString(),
        fileInfo: {
            name: fileInfo.name,
            size: fileInfo.size,
            type: fileInfo.type,
        },
        tablesCount: fileInfo.tablesCount || 0,
    };

    try {
        // Option 1: Webhook (preferred for production)
        if (WEBHOOK_URL) {
            await fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(notification),
            });
            return;
        }

        // Option 2: Email via mailto (fallback, requires user action)
        // Option 3: Console log for development
        console.log('📧 Owner Notification - Conversion:', notification);
        
        // In production, you'd integrate with:
        // - SendGrid API
        // - Resend API
        // - Nodemailer with SMTP
        // - AWS SES
        // - Backend API endpoint

    } catch (error) {
        console.error('Failed to send conversion notification:', error);
    }
};

/**
 * Send notification to owner when file is downloaded
 */
export const notifyOwnerDownload = async (downloadInfo) => {
    const notification = {
        type: 'download',
        timestamp: new Date().toISOString(),
        downloadInfo: {
            format: downloadInfo.format, // csv, xlsx, pdf
            tablesCount: downloadInfo.tablesCount || 1,
            fileName: downloadInfo.fileName,
        },
    };

    try {
        if (WEBHOOK_URL) {
            await fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(notification),
            });
            return;
        }

        console.log('📧 Owner Notification - Download:', notification);

    } catch (error) {
        console.error('Failed to send download notification:', error);
    }
};

/**
 * Setup instructions:
 * 
 * For production, create a backend endpoint (e.g., /api/notify) that:
 * 1. Receives notification data
 * 2. Sends email via service (SendGrid, Resend, etc.)
 * 3. Logs to database for analytics
 * 
 * Then set REACT_APP_NOTIFICATION_WEBHOOK_URL in .env:
 * REACT_APP_NOTIFICATION_WEBHOOK_URL=https://yourdomain.com/api/notify
 */
