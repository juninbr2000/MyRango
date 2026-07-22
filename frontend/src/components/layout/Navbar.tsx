import React from 'react'
import { FaBars } from 'react-icons/fa'
import { FaX } from 'react-icons/fa6'
import { FiMapPin } from 'react-icons/fi'
import { MdBookmarkBorder, MdOutlineCreditCard, MdOutlineLogout, MdOutlineSettings, MdOutlineShoppingCart } from 'react-icons/md'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/authContext'

function Navbar() {
  const [showMenu, setShowMenu] = React.useState(false)

  const { user, logout } = useAuth()
  const navigate = useNavigate()
  console.log(user)

  return (
    <div className='fixed top-0 left-0 flex bg-white px-4 py-2 box-border w-full justify-between items-center shadow z-50 md:px-12 md:py-4'>
        <Link to={'/'}>
          <img src="/logo.svg" alt="myRango delivery" className='w-12 h-12'/>
        </Link>
        {/* Endereço */}

        {/* notificações */}

        {/* menu */}
        <button onClick={() => setShowMenu(!showMenu)} className='text-orange-600 p-2.5 text-lg'>{showMenu ? <FaX/> :<FaBars />}</button>
        
        {showMenu && (
          <ul className={`fixed top-16 right-0 bottom-0 w-64 bg-white shadow-lg px-4 py-6 flex flex-col justify-between overflow-y-auto transform transition-transform duration-300 ${showMenu ? "translate-x-0" : "translate-x-full"}`}>
            {/* Perfil */}
            {user ? (
              <div>
                <p className='text-black text-lg font-semibold'>{user.user.name}</p>
                <p className='text-sm text-zinc-400'>{user.user.cpf}</p>
              </div>
            ):(
              <button onClick={() => navigate('/login')} className='bg-orange-600 font-semibold text-white rounded px-2 py-1.5 w-full'>Faça Login</button>
            )}
            <div>
              {/* Pedidos */}
              <Link to={'/cart'} className='menuList'><MdOutlineShoppingCart /> Carrinho</Link>
              <Link to={'/order'} className='menuList'><MdBookmarkBorder /> Meus Pedidos</Link>
              {/* Endereços */}
              <Link to={'/address'} className='menuList'><FiMapPin /> Meus Endereços</Link>
              {/* Pagamenetos */}
              <Link to={'/login'} className='menuList'><MdOutlineCreditCard /> Formas de Pagamento</Link>
              {/* configuraçoes */}
              <Link to={'/login'} className='menuList'><MdOutlineSettings /> Configurações</Link>
              {/* Sair */}
              {user && <button className='menuList' onClick={logout}><MdOutlineLogout /> Desconectar</button>}
            </div>
          </ul>
        )}
    </div>
  )
}

export default Navbar