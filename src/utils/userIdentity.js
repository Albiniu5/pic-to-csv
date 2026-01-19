// Utility to generate and manage unique user IDs for spam prevention

/**
 * Generate a unique user ID based on browser fingerprint
 * Combines multiple browser characteristics for uniqueness
 */
function generateUserId() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('fingerprint', 2, 2);
    const canvasData = canvas.toDataURL();

    const fingerprint = {
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        screenResolution: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        canvasHash: simpleHash(canvasData),
        timestamp: Date.now()
    };

    return simpleHash(JSON.stringify(fingerprint));
}

/**
 * Simple hash function for fingerprinting
 */
function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(36);
}

/**
 * Get or create a persistent user ID
 */
export function getUserId() {
    let userId = localStorage.getItem('userId');

    if (!userId) {
        userId = generateUserId();
        localStorage.setItem('userId', userId);
    }

    return userId;
}

/**
 * Check if the current user has already submitted a rating
 */
export function hasUserRated() {
    const userId = getUserId();
    const feedbacks = JSON.parse(localStorage.getItem('feedbackRatings') || '[]');

    return feedbacks.some(feedback => feedback.userId === userId);
}

/**
 * Get the user's existing rating if they've already rated
 */
export function getUserRating() {
    const userId = getUserId();
    const feedbacks = JSON.parse(localStorage.getItem('feedbackRatings') || '[]');

    const userFeedback = feedbacks.find(feedback => feedback.userId === userId);
    return userFeedback?.rating || 0;
}

/**
 * Update an existing rating instead of adding a duplicate
 */
export function updateUserRating(newRating, message = '', email = '') {
    const userId = getUserId();
    const feedbacks = JSON.parse(localStorage.getItem('feedbackRatings') || '[]');

    const existingIndex = feedbacks.findIndex(feedback => feedback.userId === userId);

    if (existingIndex !== -1) {
        // Update existing rating
        feedbacks[existingIndex] = {
            ...feedbacks[existingIndex],
            rating: newRating,
            timestamp: new Date().toISOString(),
            msg: message || feedbacks[existingIndex].msg,
            email: email || feedbacks[existingIndex].email,
            updated: true
        };
    } else {
        // Add new rating
        feedbacks.push({
            userId,
            rating: newRating,
            timestamp: new Date().toISOString(),
            msg: message || 'Star rating only',
            email: email || 'Anonymous'
        });
    }

    localStorage.setItem('feedbackRatings', JSON.stringify(feedbacks));
    return existingIndex !== -1; // Return true if it was an update
}
