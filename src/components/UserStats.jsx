import React, { useState, useEffect } from 'react';
import { Trophy, Flame, TrendingUp, Award } from 'lucide-react';
import { getUserData, incrementConversions } from '../utils/gamification';

export default function UserStats({ showCompact = false, onBadgeEarned }) {
    const [userData, setUserData] = useState(null);
    const [newBadges, setNewBadges] = useState([]);

    useEffect(() => {
        setUserData(getUserData());
    }, []);

    const handleConversion = () => {
        const updated = incrementConversions();
        setUserData(updated);
        
        // Check for new badges (this would come from incrementConversions)
        // For now, we'll check locally
        const currentBadges = userData?.badges || [];
        const latestBadges = updated.badges || [];
        
        if (latestBadges.length > currentBadges.length) {
            const earned = latestBadges.slice(currentBadges.length);
            setNewBadges(earned);
            if (onBadgeEarned) {
                onBadgeEarned(earned);
            }
            
            // Clear new badges after 5 seconds
            setTimeout(() => setNewBadges([]), 5000);
        }
    };

    if (!userData || showCompact) {
        return null; // Compact mode - don't show stats panel
    }

    return (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 md:p-6 mb-6 border border-amber-100">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-brand-dark flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-amber-600" />
                    Your Stats
                </h3>
                {userData.conversions > 0 && (
                    <span className="text-xs bg-white px-2 py-1 rounded-full text-amber-700 font-medium">
                        {userData.conversions} conversions
                    </span>
                )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {/* Conversions */}
                <div className="text-center">
                    <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-brand-dark">{userData.conversions}</div>
                    <div className="text-xs text-brand-muted mt-1">Total Conversions</div>
                </div>

                {/* Streak */}
                {userData.streak > 0 && (
                    <div className="text-center">
                        <Flame className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-brand-dark">{userData.streak}</div>
                        <div className="text-xs text-brand-muted mt-1">Day Streak</div>
                    </div>
                )}

                {/* Badges */}
                {userData.badges && userData.badges.length > 0 && (
                    <div className="text-center">
                        <Award className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-brand-dark">{userData.badges.length}</div>
                        <div className="text-xs text-brand-muted mt-1">Badges Earned</div>
                    </div>
                )}
            </div>

            {/* New Badge Notification */}
            {newBadges.length > 0 && (
                <div className="mt-4 p-3 bg-white rounded-lg border-2 border-amber-400 animate-in zoom-in duration-300">
                    <div className="flex items-center gap-3">
                        <span className="text-3xl">{newBadges[0].emoji}</span>
                        <div className="flex-1">
                            <div className="font-bold text-brand-dark text-sm">New Badge Earned!</div>
                            <div className="text-xs text-brand-muted">{newBadges[0].name}</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
