import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, FileSpreadsheet } from 'lucide-react';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <nav className="bg-white border-b border-brand-border sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="bg-brand-blue text-white p-1.5 rounded-lg">
                                <FileSpreadsheet size={24} />
                            </div>
                            <span className="font-bold text-xl text-brand-dark tracking-tight">PicToCSV</span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8" style={{ lineHeight: 'normal' }}>
                        <NavLink to="/" isActive={isActive('/')}>Home</NavLink>
                        <NavLink to="/how-it-works" isActive={isActive('/how-it-works')}>How It Works</NavLink>
                        <NavLink to="/faq" isActive={isActive('/faq')}>FAQ</NavLink>
                        <a
                            href="https://comparedocsai.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-base font-normal text-brand-dark hover:text-brand-blue transition-colors"
                            style={{ display: 'inline-flex', alignItems: 'center', height: '100%' }}
                        >
                            Compare Docs
                        </a>
                        <Link
                            to="/"
                            className="bg-brand-blue hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-sm hover:shadow-md"
                            style={{ display: 'inline-flex', alignItems: 'center' }}
                        >
                            Start Converting
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={toggleMenu}
                            className="text-brand-muted hover:text-brand-dark p-2"
                            aria-label="Toggle menu"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-b border-brand-border">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <MobileNavLink to="/" onClick={toggleMenu} isActive={isActive('/')}>Home</MobileNavLink>
                        <MobileNavLink to="/how-it-works" onClick={toggleMenu} isActive={isActive('/how-it-works')}>How It Works</MobileNavLink>
                        <MobileNavLink to="/faq" onClick={toggleMenu} isActive={isActive('/faq')}>FAQ</MobileNavLink>
                        <a
                            href="https://pictocsv.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block px-3 py-2 rounded-md text-base font-medium text-brand-muted hover:bg-slate-50 hover:text-brand-dark"
                            onClick={toggleMenu}
                        >
                            Compare Docs AI
                        </a>
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
            className={`text-base font-normal transition-colors ${isActive ? 'text-brand-blue' : 'text-brand-dark hover:text-brand-blue'
                }`}
            style={{ display: 'inline-flex', alignItems: 'center', height: '100%', lineHeight: 'normal' }}
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
                ? 'bg-blue-50 text-brand-blue'
                : 'text-brand-muted hover:bg-slate-50 hover:text-brand-dark'
                }`}
        >
            {children}
        </Link>
    );
}
