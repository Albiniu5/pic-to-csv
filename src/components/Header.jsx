import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, FileSpreadsheet } from 'lucide-react';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="bg-indigo-600 text-white p-1.5 rounded-lg">
                                <FileSpreadsheet size={24} />
                            </div>
                            <span className="font-bold text-xl text-slate-900 tracking-tight">PicToCSV</span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        <NavLink to="/" isActive={isActive('/')}>Home</NavLink>
                        <NavLink to="/how-it-works" isActive={isActive('/how-it-works')}>How It Works</NavLink>
                        <NavLink to="/faq" isActive={isActive('/faq')}>FAQ</NavLink>
                        <Link
                            to="/"
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                            Start Converting
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={toggleMenu}
                            className="text-slate-600 hover:text-slate-900 p-2"
                            aria-label="Toggle menu"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-b border-slate-200">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <MobileNavLink to="/" onClick={toggleMenu} isActive={isActive('/')}>Home</MobileNavLink>
                        <MobileNavLink to="/how-it-works" onClick={toggleMenu} isActive={isActive('/how-it-works')}>How It Works</MobileNavLink>
                        <MobileNavLink to="/faq" onClick={toggleMenu} isActive={isActive('/faq')}>FAQ</MobileNavLink>
                        <MobileNavLink to="/privacy" onClick={toggleMenu} isActive={isActive('/privacy')}>Privacy Policy</MobileNavLink>
                        <MobileNavLink to="/contact" onClick={toggleMenu} isActive={isActive('/contact')}>Contact</MobileNavLink>
                    </div>
                </div>
            )}
        </nav>
    );
}

function NavLink({ to, children, isActive }) {
    return (
        <Link
            to={to}
            className={`text-sm font-medium transition-colors ${isActive ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'
                }`}
        >
            {children}
        </Link>
    );
}

function MobileNavLink({ to, children, onClick, isActive }) {
    return (
        <Link
            to={to}
            onClick={onClick}
            className={`block px-3 py-2 rounded-md text-base font-medium ${isActive
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
        >
            {children}
        </Link>
    );
}
