import React, { useState, useEffect } from 'react';
import { Eye, TrendingUp, CheckCircle } from 'lucide-react';
import { getSocialProofStats } from '../utils/gamification';

export default function SocialProof() {
    // Hidden - bar is disabled
    return null;
    
    const [stats, setStats] = useState(() => getSocialProofStats());

    useEffect(() => {
        // Initialize with real data
        setStats(getSocialProofStats());
        
        // Update stats periodically
        const interval = setInterval(() => {
            setStats(getSocialProofStats());
        }, 30000); // Update every 30 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-6 border border-blue-100 mb-8 animate-in fade-in slide-in-from-bottom-2">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div className="flex flex-col items-center">
                    <Eye className="w-6 h-6 text-brand-blue mb-2" />
                    <div className="text-2xl sm:text-3xl font-bold text-brand-dark">{stats.totalUsers}</div>
                    <div className="text-xs sm:text-sm text-brand-muted mt-1">Total Visits</div>
                </div>
                <div className="flex flex-col items-center">
                    <TrendingUp className="w-6 h-6 text-green-600 mb-2" />
                    <div className="text-2xl sm:text-3xl font-bold text-brand-dark">{stats.recentConversions}</div>
                    <div className="text-xs sm:text-sm text-brand-muted mt-1">Converted Today</div>
                </div>
                <div className="flex flex-col items-center">
                    <CheckCircle className="w-6 h-6 text-emerald-600 mb-2" />
                    <div className="text-2xl sm:text-3xl font-bold text-brand-dark">{stats.successRate}</div>
                    <div className="text-xs sm:text-sm text-brand-muted mt-1">Accuracy Rate</div>
                </div>
            </div>
        </div>
    );
}
