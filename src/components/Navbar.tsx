import { useState, useEffect } from 'react';
import { Moon, Sun, Menu, X, Search, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/useTheme';

interface NavbarProps {
  onSearchClick: () => void;
  onAdminClick: () => void;
}

export const Navbar = ({ onSearchClick, onAdminClick }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-40 transition-all duration-500 ease-in-out ${
        isScrolled
          ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg py-2'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img 
              src="/assets/logo.png" 
              alt="Bios Maris Logo" 
              className="w-12 h-12 object-contain logo"
            />
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Bios Maris
              </h1>
              <p className="text-xs text-[#d8be7d]">
                Compléments Alimentaires
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <a
              href="#home"
              className="text-gray-700 dark:text-gray-300 hover:text-[#d8be7d] transition-colors"
            >
              Accueil
            </a>
            <a
              href="#about"
              className="text-gray-700 dark:text-gray-300 hover:text-[#d8be7d] transition-colors"
            >
              À Propos
            </a>
            <a
              href="#products"
              className="text-gray-700 dark:text-gray-300 hover:text-[#d8be7d] transition-colors"
            >
              Produits
            </a>
            <a
              href="#benefits"
              className="text-gray-700 dark:text-gray-300 hover:text-[#d8be7d] transition-colors"
            >
              Bienfaits
            </a>
            <a
              href="#contact"
              className="text-gray-700 dark:text-gray-300 hover:text-[#d8be7d] transition-colors"
            >
              Contact
            </a>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onSearchClick}
              className="text-gray-700 dark:text-gray-300 hover:text-[#d8be7d]"
            >
              <Search className="h-5 w-5" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={onAdminClick}
              className="text-gray-700 dark:text-gray-300 hover:text-[#d8be7d]"
            >
              <Shield className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-gray-700 dark:text-gray-300 hover:text-[#d8be7d]"
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-gray-700 dark:text-gray-300"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col space-y-3 pt-4">
              <a
                href="#home"
                className="text-gray-700 dark:text-gray-300 hover:text-[#d8be7d] transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Accueil
              </a>
              <a
                href="#about"
                className="text-gray-700 dark:text-gray-300 hover:text-[#d8be7d] transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                À Propos
              </a>
              <a
                href="#products"
                className="text-gray-700 dark:text-gray-300 hover:text-[#d8be7d] transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Produits
              </a>
              <a
                href="#benefits"
                className="text-gray-700 dark:text-gray-300 hover:text-[#d8be7d] transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Bienfaits
              </a>
              <a
                href="#contact"
                className="text-gray-700 dark:text-gray-300 hover:text-[#d8be7d] transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};