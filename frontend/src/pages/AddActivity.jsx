import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus } from 'lucide-react';
import axiosInstance from '../services/axiosInstance';
import Navbar from '../components/Navbar';

const AddActivity = () => {
    const navigate = useNavigate();
    const [type, setType] = useState('Car Travel');
    const [quantity, setQuantity] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const activityTypes = [
        { name: 'Car Travel', unit: 'km', icon: '🚗' },
        { name: 'Electricity', unit: 'kWh', icon: '⚡' },
        { name: 'Flight', unit: 'km', icon: '✈️' },
        { name: 'Public Transport', unit: 'km', icon: '🚌' },
        { name: 'Walking', unit: 'km', icon: '🚶' },
        { name: 'Cycling', unit: 'km', icon: '🚴' },
        { name: 'Streaming (Video)', unit: 'hours', icon: '🎬' },
        { name: 'Internet Data', unit: 'GB', icon: '🌐' },
        { name: 'Gaming', unit: 'hours', icon: '🎮' },
    ];

    const currentActivity = activityTypes.find((a) => a.name === type) || activityTypes[0];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await axiosInstance.post('/activities', {
                type,
                quantity: parseFloat(quantity),
            });
            alert('Activity logged! Keep up the great work! 🌿');
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add activity');
        } finally {
            setLoading(false);
        }
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.05 },
        },
    };

    const item = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0 },
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <Navbar />
            <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card rounded-3xl p-8"
                >
                    <div className="mb-8 flex items-center gap-4">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="rounded-full bg-slate-100 p-2 text-slate-600 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Log New Activity</h1>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mb-6 rounded-xl bg-red-50 p-4 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                        >
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                            {activityTypes.map((t) => (
                                <motion.div
                                    key={t.name}
                                    variants={item}
                                    onClick={() => setType(t.name)}
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`cursor-pointer rounded-2xl border p-4 text-center transition-all ${type === t.name
                                            ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-200 dark:bg-emerald-900/20 dark:ring-emerald-900'
                                            : 'border-slate-200 bg-white hover:border-emerald-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-700'
                                        }`}
                                >
                                    <div className="text-3xl">{t.icon}</div>
                                    <div className="mt-3 text-sm font-medium text-slate-700 dark:text-slate-300">{t.name}</div>
                                </motion.div>
                            ))}
                        </motion.div>

                        <div className="rounded-2xl bg-slate-50 p-6 dark:bg-slate-900/50">
                            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                Quantity ({currentActivity.unit})
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    step="0.01"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    required
                                    className="glass-input w-full rounded-xl px-4 py-3 text-lg text-slate-900 dark:text-white"
                                    placeholder="e.g., 10"
                                />
                                <span className="absolute right-4 top-3.5 font-medium text-slate-400">
                                    {currentActivity.unit}
                                </span>
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 py-4 text-lg font-bold text-white shadow-lg shadow-emerald-500/25 transition-all hover:shadow-emerald-500/40 disabled:opacity-70"
                        >
                            {loading ? 'Adding...' : 'Add Activity'}
                            {!loading && <Plus size={20} />}
                        </motion.button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default AddActivity;
