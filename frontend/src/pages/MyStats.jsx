import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Calendar, Activity, Leaf } from 'lucide-react';
import axiosInstance from '../services/axiosInstance';
import Navbar from '../components/Navbar';

const getUnit = (type) => {
    const units = {
        'Car Travel': 'km',
        'Electricity': 'kWh',
        'Flight': 'km',
        'Public Transport': 'km',
        'Walking': 'km',
        'Cycling': 'km',
        'Streaming (Video)': 'hours',
        'Internet Data': 'GB',
        'Gaming': 'hours',
    };
    return units[type] || 'units';
};

const MyStats = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const { data } = await axiosInstance.get('/activities');
                setActivities(data);
            } catch (error) {
                console.error('Failed to fetch activities', error);
            } finally {
                setLoading(false);
            }
        };

        fetchActivities();
    }, []);

    const totalEmissions = activities.reduce((sum, act) => sum + act.emissionAmount, 0);

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
                className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8"
            >
                <div className="mb-8 grid gap-6 md:grid-cols-2">
                    <motion.div variants={item} className="glass-card rounded-2xl p-6">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-emerald-100 p-2 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                                <Leaf size={24} />
                            </div>
                            <h2 className="text-lg font-semibold text-slate-600 dark:text-slate-400">Total Emissions</h2>
                        </div>
                        <p className="mt-4 text-4xl font-bold text-emerald-600 dark:text-emerald-400">
                            {totalEmissions.toFixed(2)} <span className="text-lg text-slate-500 dark:text-slate-500">kg CO₂</span>
                        </p>
                    </motion.div>

                    <motion.div variants={item} className="glass-card rounded-2xl p-6">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-blue-100 p-2 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                <Activity size={24} />
                            </div>
                            <h2 className="text-lg font-semibold text-slate-600 dark:text-slate-400">Total Activities</h2>
                        </div>
                        <p className="mt-4 text-4xl font-bold text-blue-600 dark:text-blue-400">{activities.length}</p>
                    </motion.div>
                </div>

                <motion.div variants={item} className="glass-card overflow-hidden rounded-2xl shadow-lg">
                    <div className="border-b border-slate-200 bg-slate-50/50 p-6 dark:border-slate-800 dark:bg-slate-900/50">
                        <h2 className="flex items-center gap-2 text-xl font-bold text-slate-800 dark:text-white">
                            <BarChart3 size={20} className="text-emerald-500" />
                            Activity History
                        </h2>
                    </div>
                    {loading ? (
                        <div className="p-8 text-center text-slate-500">Loading stats...</div>
                    ) : activities.length === 0 ? (
                        <div className="p-12 text-center text-slate-500 dark:text-slate-400">
                            No activities logged yet. Start tracking to see your stats!
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                                <thead className="bg-slate-50 dark:bg-slate-900/50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                            Date
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                            Type
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                            Quantity
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                            Emissions (kg CO₂)
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-800 dark:bg-slate-950">
                                    {activities.map((activity) => (
                                        <motion.tr
                                            key={activity.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
                                            className="transition-colors dark:hover:bg-white/5"
                                        >
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={14} />
                                                    {new Date(activity.date).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">
                                                {activity.type}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                                                {activity.quantity} {getUnit(activity.type)}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm">
                                                <span
                                                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${activity.emissionAmount < 0
                                                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
                                                            : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
                                                        }`}
                                                >
                                                    {activity.emissionAmount.toFixed(2)}
                                                </span>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </div>
    );
};

export default MyStats;
