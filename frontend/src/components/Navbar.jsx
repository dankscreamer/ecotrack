import { Link, useNavigate } from 'react-router-dom';
import { Leaf, LogOut } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('ecotrack_token');
        navigate('/login');
    };

    return (
        <nav className="sticky top-0 z-50 border-b border-slate-200/50 bg-white/80 backdrop-blur-xl dark:border-slate-800/50 dark:bg-slate-950/80">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 justify-between">
                    <div className="flex">
                        <div className="flex flex-shrink-0 items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30">
                                <Leaf size={18} />
                            </div>
                            <Link to="/dashboard" className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                                EcoTrack
                            </Link>
                        </div>
                        <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
                            {['Dashboard', 'Add Activity', 'My Stats', 'Profile'].map((item) => (
                                <Link
                                    key={item}
                                    to={`/${item.toLowerCase().replace(' ', '-')}`}
                                    className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-slate-500 transition-colors hover:border-emerald-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                                >
                                    {item}
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                        >
                            <LogOut size={16} />
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
