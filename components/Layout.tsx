import React, { useState } from 'react';
import { ShoppingCart, User, Menu, X, LogOut, LayoutDashboard, Search, Heart, Store } from 'lucide-react';
import type { User as UserType, Category, StoreConfig } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: UserType | null;
  cartCount: number;
  categories: Category[];
  storeConfig: StoreConfig | null;
  onLogout: () => void;
  onViewChange: (view: 'store' | 'admin' | 'profile' | 'cart' | 'checkout' | 'login' | 'register' | 'forgot-password') => void;
  currentView: string;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  user,
  cartCount,
  categories,
  storeConfig,
  onLogout,
  onViewChange,
  currentView,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showCategories, setShowCategories] = useState(false);

  const storeName = storeConfig?.name || 'VendaPro';

  const isActiveView = (view: string) => currentView === view;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-8">
              <button
                onClick={() => onViewChange('store')}
                className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors"
              >
                {storeName}
              </button>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center gap-6">
                <button
                  onClick={() => onViewChange('store')}
                  className={`text-sm font-medium transition-colors ${
                    isActiveView('store') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  Início
                </button>

                {/* Categories Dropdown */}
                <div className="relative">
                  <button
                    onMouseEnter={() => setShowCategories(true)}
                    onMouseLeave={() => setShowCategories(false)}
                    className={`text-sm font-medium transition-colors py-5 ${
                      isActiveView('store') ? 'text-gray-700 hover:text-blue-600' : 'text-gray-700 hover:text-blue-600'
                    }`}
                  >
                    Categorias
                  </button>

                  {showCategories && categories.length > 0 && (
                    <div
                      onMouseEnter={() => setShowCategories(true)}
                      onMouseLeave={() => setShowCategories(false)}
                      className="absolute top-full left-0 w-56 bg-white shadow-lg rounded-b-xl border border-t-0 border-gray-100 py-2 z-50"
                    >
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => { onViewChange('store'); setShowCategories(false); }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </nav>
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar produtos..."
                  className="w-64 pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>

              {/* Cart */}
              <button
                onClick={() => onViewChange('cart')}
                className="p-2 rounded-lg hover:bg-gray-100 relative transition-colors"
              >
                <ShoppingCart className="w-5 h-5 text-gray-700" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </button>

              {/* User Menu */}
              {user ? (
                <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                  {user.role === 'admin' && (
                    <button
                      onClick={() => onViewChange('admin')}
                      className={`p-2 rounded-lg transition-colors ${
                        isActiveView('admin') ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100 text-gray-700'
                      }`}
                      title="Painel Administrativo"
                    >
                      <LayoutDashboard className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={() => onViewChange('profile')}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                      isActiveView('profile') ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <User className="w-5 h-5" />
                    <span className="text-sm font-medium">{user.name.split(' ')[0]}</span>
                  </button>
                  <button
                    onClick={onLogout}
                    className="p-2 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors"
                    title="Sair"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 pl-4 border-l border-gray-200">
                  <button
                    onClick={() => onViewChange('login')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActiveView('login') || isActiveView('register')
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Entrar
                  </button>
                  <button
                    onClick={() => onViewChange('register')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    Criar conta
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center gap-2">
              <button
                onClick={() => onViewChange('cart')}
                className="p-2 rounded-lg hover:bg-gray-100 relative"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold w-4 h-4 flex items-center justify-center rounded-full">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100">
            <div className="px-4 py-4 space-y-2">
              {/* Mobile Search */}
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="Buscar produtos..."
                  className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-lg text-sm"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>

              <button
                onClick={() => { onViewChange('store'); setIsMenuOpen(false); }}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-gray-100"
              >
                <Store className="w-5 h-5" />
                <span className="font-medium">Início</span>
              </button>

              {/* Categories in mobile menu */}
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => { onViewChange('store'); setIsMenuOpen(false); }}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-gray-100 pl-12"
                >
                  <span className="text-gray-600">{cat.name}</span>
                </button>
              ))}

              <hr className="border-gray-200 my-2" />

              {user ? (
                <>
                  <button
                    onClick={() => { onViewChange('profile'); setIsMenuOpen(false); }}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-gray-100"
                  >
                    <User className="w-5 h-5" />
                    <span className="font-medium">Minha Conta</span>
                  </button>
                  {user.role === 'admin' && (
                    <button
                      onClick={() => { onViewChange('admin'); setIsMenuOpen(false); }}
                      className="flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-gray-100"
                    >
                      <LayoutDashboard className="w-5 h-5" />
                      <span className="font-medium">Painel Admin</span>
                    </button>
                  )}
                  <button
                    onClick={() => { onLogout(); setIsMenuOpen(false); }}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-red-50 text-red-600"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Sair</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => { onViewChange('login'); setIsMenuOpen(false); }}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-gray-100"
                  >
                    <User className="w-5 h-5" />
                    <span className="font-medium">Entrar</span>
                  </button>
                  <button
                    onClick={() => { onViewChange('register'); setIsMenuOpen(false); }}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-lg bg-blue-600 text-white"
                  >
                    <User className="w-5 h-5" />
                    <span className="font-medium">Criar conta</span>
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-xl font-bold text-white mb-4">{storeName}</h3>
              <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
                Moda elegante e sofisticada para todas as ocasiões. Encontre as melhores peças com qualidade premium e preço justo.
              </p>
              {storeConfig?.contactEmail && (
                <p className="mt-4 text-sm text-gray-400">
                  {storeConfig.contactEmail}
                </p>
              )}
              {storeConfig?.contactPhone && (
                <p className="text-sm text-gray-400">
                  {storeConfig.contactPhone}
                </p>
              )}
            </div>

            {/* Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Navegação</h4>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => onViewChange('store')} className="text-sm hover:text-white transition-colors">
                    Início
                  </button>
                </li>
                <li>
                  <button onClick={() => onViewChange(user ? 'profile' : 'login')} className="text-sm hover:text-white transition-colors">
                    Minha Conta
                  </button>
                </li>
                <li>
                  <button onClick={() => onViewChange('cart')} className="text-sm hover:text-white transition-colors">
                    Carrinho
                  </button>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><span className="text-sm hover:text-white transition-colors cursor-pointer">Termos de Uso</span></li>
                <li><span className="text-sm hover:text-white transition-colors cursor-pointer">Política de Privacidade</span></li>
                <li><span className="text-sm hover:text-white transition-colors cursor-pointer">Trocas e Devoluções</span></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} {storeName}. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
