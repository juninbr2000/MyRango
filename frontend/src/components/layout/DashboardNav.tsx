import { Link } from 'react-router-dom'

interface propsnav {
    title: string
}

function DashboardNav({ title }: propsnav) {
  return (
    <nav className="bg-white border-b border-zinc-200/80 px-4 py-4 sticky top-0 z-20 shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-orange-500 text-white font-black text-xs px-2 py-0.5 rounded">
              ADMIN
            </span>
            <h1 className="text-xl font-extrabold text-black">Painel MyRango</h1>
          </div>
          <p className="text-xs text-zinc-400 font-medium mt-0.5">{title}</p>
        </div>

        <div>
          <ul className="flex items-center gap-2 bg-zinc-100 p-1 rounded-xl">
            <li>
              <Link
                to="/dashboard"
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all block ${
                  location.pathname === '/dashboard'
                    ? 'bg-white text-orange-600 shadow-xs'
                    : 'text-zinc-600 hover:text-black'
                }`}
              >
                Pedidos
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/products"
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all block ${
                  location.pathname.includes('/products')
                    ? 'bg-white text-orange-600 shadow-xs'
                    : 'text-zinc-600 hover:text-black'
                }`}
              >
                Produtos
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default DashboardNav