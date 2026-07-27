import React, { useState } from 'react'
import { FaBars, FaChevronDown } from 'react-icons/fa'
import { FaLocationDot, FaXmark } from 'react-icons/fa6'
import { FiMapPin } from 'react-icons/fi'
import { MdBookmarkBorder, MdLogin, MdOutlineCreditCard, MdOutlineLogout, MdOutlineSettings, MdOutlineShoppingCart } from 'react-icons/md'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/authContext'

export default function Navbar() {
  const [showMenu, setShowMenu] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Fecha o menu ao trocar de rota
  React.useEffect(() => {
    setShowMenu(false)
  }, [location])

  return (
    <>
      <header className="fixed top-0 left-0 w-full bg-white/90 backdrop-blur-md border-b border-zinc-200/80 px-4 md:px-8 py-2.5 z-50 flex items-center justify-between shadow-xs">
        
        {/* Logo & Marca */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 group">
            <img 
              src="/logo.svg" 
              alt="myRango delivery" 
              className="w-10 h-10 object-contain transition-transform group-hover:scale-105" 
            />
            <span className="hidden sm:inline font-black text-xl tracking-tight text-zinc-900">
              my<span className="text-orange-500">Rango</span>
            </span>
          </Link>

          {/* Selector / Indicador de Endereço Rápido */}
          <button 
            onClick={() => navigate('/address')}
            className="hidden md:flex items-center gap-2 bg-zinc-100 hover:bg-zinc-200/80 px-3 py-1.5 rounded-full text-xs transition-colors border border-zinc-200/60"
          >
            <FaLocationDot className="text-orange-500 text-sm" />
            <div className="text-left">
              <p className="text-[10px] font-bold text-zinc-400 uppercase leading-none">Entregar em</p>
              <p className="font-extrabold text-zinc-800 line-clamp-1 max-w-[140px]">
                {user?.address || 'Selecione um endereço'}
              </p>
            </div>
            <FaChevronDown className="text-zinc-400 text-[10px] ml-1" />
          </button>
        </div>

        {/* Endereço Mobile Simplificado */}
        <button 
          onClick={() => navigate('/address')}
          className="flex md:hidden items-center gap-1.5 text-xs text-zinc-700 bg-zinc-100 px-3 py-1 rounded-full border border-zinc-200"
        >
          <FaLocationDot className="text-orange-500 text-xs" />
          <span className="font-bold max-w-[120px] truncate">
            {user?.address || 'Seu endereço'}
          </span>
        </button>

        {/* Botão de Abrir/Fechar Menu */}
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="p-2 text-zinc-700 hover:text-orange-500 hover:bg-orange-50 rounded-xl transition-all active:scale-95 text-xl"
          aria-label="Abrir menu"
        >
          {showMenu ? <FaXmark /> : <FaBars />}
        </button>
      </header>

      {/* Overlay Escuro quando o Menu está Aberto */}
      {showMenu && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 transition-opacity"
          onClick={() => setShowMenu(false)}
        />
      )}

      {/* Menu Lateral Drawer (Slide-in) */}
      <aside
        className={`fixed top-0 right-0 h-full w-72 bg-white z-50 shadow-2xl flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          showMenu ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Topo do Drawer (Cabeçalho do Perfil) */}
        <div className="p-5 border-b border-zinc-100">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-extrabold uppercase tracking-wider text-zinc-400">
              Minha Conta
            </span>
            <button 
              onClick={() => setShowMenu(false)}
              className="text-zinc-400 hover:text-black p-1 transition-colors"
            >
              <FaXmark className="text-lg" />
            </button>
          </div>

          {user ? (
            <div className="flex items-center gap-3 bg-orange-50/60 p-3 rounded-2xl border border-orange-100">
              <div className="w-11 h-11 rounded-xl bg-orange-500 text-white font-extrabold flex items-center justify-center text-lg shadow-sm">
                {user?.user?.name ? user.user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-black truncate">
                  {user?.user?.name || 'Usuário'}
                </p>
                {user?.user?.cpf && (
                  <p className="text-xs text-zinc-400 font-medium truncate">
                    CPF: {user.user.cpf}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm active:scale-95"
            >
              <MdLogin className="text-lg" />
              <span>Entrar ou Criar Conta</span>
            </button>
          )}
        </div>

        {/* Links de Navegação Principal */}
        <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <MenuLink to="/cart" icon={<MdOutlineShoppingCart />} label="Carrinho" />
          <MenuLink to="/order" icon={<MdBookmarkBorder />} label="Meus Pedidos" />
          <MenuLink to="/address" icon={<FiMapPin />} label="Meus Endereços" />
          <MenuLink to="/" icon={<MdOutlineCreditCard />} label="Formas de Pagamento" />
          <MenuLink to="/" icon={<MdOutlineSettings />} label="Configurações" />
        </div>

        {/* Rodapé do Menu (Desconectar) */}
        {user && (
          <div className="p-4 border-t border-zinc-100">
            <button
              onClick={() => {
                logout()
                setShowMenu(false)
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-red-500 hover:bg-red-50 font-bold text-sm rounded-xl transition-colors"
            >
              <MdOutlineLogout className="text-lg" />
              <span>Desconectar da conta</span>
            </button>
          </div>
        )}
      </aside>
    </>
  )
}

/* Helper Item de Menu */
function MenuLink({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 px-3.5 py-3 text-zinc-700 hover:text-orange-600 hover:bg-orange-50/80 font-bold text-sm rounded-xl transition-all"
    >
      <span className="text-xl text-zinc-400 group-hover:text-orange-500">{icon}</span>
      <span>{label}</span>
    </Link>
  )
}