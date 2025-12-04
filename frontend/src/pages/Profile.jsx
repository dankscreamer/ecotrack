import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User, Award, Star, Mail, Calendar } from 'lucide-react';
import axiosInstance from '../services/axiosInstance';
import Navbar from '../components/Navbar';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [rewards, setRewards] = useState({ points: 0, badges: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userRes, rewardsRes] = await Promise.all([
                    axiosInstance.get('/auth/me'),
                    axiosInstance.get('/rewards'),
                ]);
                setUser(userRes.data.user);
                setRewards(rewardsRes.data);
            } catch (error) {
                console.error('Failed to fetch profile data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-600 dark:bg-slate-950 dark:text-slate-400">
                Loading profile...
            </div>
        );
    }

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
        },
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <Navbar />
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8"
            >
                <motion.div variants={item} className="mb-8 overflow-hidden rounded-3xl bg-white shadow-xl dark:bg-slate-900">
                    <div className="h-32 bg-gradient-to-r from-emerald-500 to-teal-600 dark:from-emerald-600 dark:to-teal-800"></div>
                    <div className="px-8 pb-8">
                        <div className="relative -mt-16 mb-6 flex justify-center sm:justify-start">
                            <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-white bg-slate-100 text-slate-400 shadow-lg dark:border-slate-900 dark:bg-slate-800">
                                <User size={64} />
                            </div>
                        </div>

                        <div className="text-center sm:text-left">
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{user?.name}</h1>
                            <div className="mt-2 flex flex-wrap justify-center gap-4 text-slate-500 dark:text-slate-400 sm:justify-start">
                                <div className="flex items-center gap-1">
                                    <Mail size={16} />
                                    {user?.email}
                                </div>
                                <div className="flex items-center gap-1">
                                    <Calendar size={16} />
                                    Joined {new Date().getFullYear()}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <div className="grid gap-8 md:grid-cols-2">
                    <motion.div variants={item} className="glass-card rounded-2xl p-6">
                        <div className="mb-6 flex items-center gap-3">
                            <div className="rounded-lg bg-yellow-100 p-2 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400">
                                <Star size={24} />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Eco Points</h2>
                        </div>
                        <div className="text-center">
                            <p className="text-5xl font-bold text-slate-900 dark:text-white">{rewards.points}</p>
                            <p className="mt-2 text-slate-500 dark:text-slate-400">Total Points Earned</p>
                            <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                                <div
                                    className="h-full bg-gradient-to-r from-yellow-400 to-orange-500"
                                    style={{ width: `${Math.min(rewards.points / 10, 100)}%` }}
                                ></div>
                            </div>
                            <p className="mt-2 text-xs text-slate-400">
                                {1000 - (rewards.points % 1000)} points to next level
                            </p>
                        </div>
                    </motion.div>

                    <motion.div variants={item} className="glass-card rounded-2xl p-6">
                        <div className="mb-6 flex items-center gap-3">
                            <div className="rounded-lg bg-purple-100 p-2 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                                <Award size={24} />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Badges</h2>
                        </div>
                        {rewards.badges.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 text-center text-slate-500 dark:text-slate-400">
                                <Award size={48} className="mb-3 text-slate-300 dark:text-slate-700" />
                                <p>No badges earned yet.</p>
                                <p className="text-sm">Keep logging activities to unlock badges!</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-3 gap-4">
                                {rewards.badges.map((badge) => (
                                    <motion.div
                                        key={badge.id}
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        className="flex flex-col items-center rounded-xl bg-slate-50 p-3 text-center dark:bg-slate-800"
                                    >
                                        <div className="mb-2 text-3xl">{badge.icon}</div>
                                        <p className="text-xs font-medium text-slate-700 dark:text-slate-300">{badge.name}</p>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default Profile;
