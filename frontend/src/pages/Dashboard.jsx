import { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, ArrowRight, Activity, Leaf, TrendingUp } from 'lucide-react';
import axiosInstance from '../services/axiosInstance.js';
import Navbar from '../components/Navbar.jsx';
import EcoNudge from '../components/EcoNudge.jsx';

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

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(new Audio('https://actions.google.com/sounds/v1/nature/forest_morning.ogg'));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, activitiesRes] = await Promise.all([
          axiosInstance.get('/auth/me'),
          axiosInstance.get('/activities'),
        ]);
        setUser(userRes.data.user);
        setRecentActivities(activitiesRes.data.slice(0, 3));
      } catch (error) {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('ecotrack_token');
          navigate('/login');
        } else {
          console.error("Dashboard load failed", error);
          // Optional: Set an error state to show a message to the user
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const toggleSound = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((e) => console.log('Audio play failed', e));
    }
    setIsPlaying(!isPlaying);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-600 dark:bg-slate-950 dark:text-slate-400">
        Loading dashboard...
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
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
        className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"
      >
        <motion.div
          variants={item}
          className="mb-8 rounded-3xl bg-gradient-to-r from-emerald-500 to-teal-600 p-8 text-white shadow-xl shadow-emerald-500/20 dark:from-emerald-600 dark:to-teal-700"
        >
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name}!</h1>
              <p className="mt-2 text-emerald-100">
                Track your activities and reduce your carbon footprint today.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={toggleSound}
                className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-medium backdrop-blur-sm transition hover:bg-white/30"
              >
                {isPlaying ? <Volume2 size={16} /> : <VolumeX size={16} />}
                {isPlaying ? 'Pause Nature' : 'Play Nature'}
              </button>
              <Link
                to="/add-activity"
                className="flex items-center gap-2 rounded-full bg-white px-6 py-2 text-sm font-bold text-emerald-600 transition hover:bg-emerald-50 hover:shadow-lg"
              >
                Log Activity <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </motion.div>

        <motion.div variants={item} className="mb-8">
          <EcoNudge activities={recentActivities} />
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <motion.div variants={item} className="glass-card col-span-2 rounded-2xl p-6">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-emerald-100 p-2 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                  <Activity size={20} />
                </div>
                <h2 className="text-lg font-bold text-slate-800 dark:text-white">Recent Activities</h2>
              </div>
              <Link
                to="/my-stats"
                className="text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
              >
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {recentActivities.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="mb-3 rounded-full bg-slate-100 p-4 dark:bg-slate-800">
                    <Leaf className="text-slate-400" size={24} />
                  </div>
                  <p className="text-slate-500 dark:text-slate-400">No activities logged yet.</p>
                  <Link to="/add-activity" className="mt-2 text-sm font-medium text-emerald-600 hover:underline">
                    Start logging now
                  </Link>
                </div>
              ) : (
                recentActivities.map((activity) => (
                  <motion.div
                    key={activity.id}
                    whileHover={{ scale: 1.01 }}
                    className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:bg-slate-800"
                  >
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{activity.type}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {new Date(activity.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-bold ${activity.emissionAmount < 0
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-slate-800 dark:text-slate-200'
                          }`}
                      >
                        {activity.emissionAmount > 0 ? '+' : ''}
                        {activity.emissionAmount.toFixed(2)} kg CO₂
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {activity.quantity} {getUnit(activity.type)}
                      </p>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>

          <motion.div variants={item} className="glass-card rounded-2xl p-6">
            <div className="mb-6 flex items-center gap-2">
              <div className="rounded-lg bg-blue-100 p-2 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                <TrendingUp size={20} />
              </div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">Quick Stats</h2>
            </div>
            <div className="space-y-4">
              <div className="rounded-xl bg-slate-50 p-5 dark:bg-slate-900/50">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Activities</p>
                <p className="mt-1 text-3xl font-bold text-slate-800 dark:text-white">
                  {recentActivities.length > 0 ? 'See Stats' : '0'}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-5 dark:bg-slate-900/50">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Eco Points</p>
                <p className="mt-1 text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                  {user?.points || 0}
                </p>
              </div>
            </div>
            <div className="mt-6">
              <Link
                to="/profile"
                className="flex w-full items-center justify-center rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                View Full Profile
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
