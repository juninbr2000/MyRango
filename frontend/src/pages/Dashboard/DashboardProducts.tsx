import { useEffect, useState } from 'react'
import DashboardNav from '../../components/layout/DashboardNav'
import { FaPlus, FaUtensils } from 'react-icons/fa'
import type { ProductFullData } from '../../types/ProductsTypes'
import { useFetchDocuments } from '../../Hooks/usefetchDocuments'
import { FaMagnifyingGlass } from 'react-icons/fa6'
import { useAuth } from '../../context/authContext'
import axios from 'axios'
import { ProductCard } from '../../components/layout/ProductCard'
import { useDeleteDocuments } from '../../Hooks/useDeleteDocuments'
import { useNavigate } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL;

function DashboardProducts() {
  const [products, setProducts] = useState<ProductFullData[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const { user } = useAuth()
  const { document, loading } = useFetchDocuments<ProductFullData[]>(
    'product',
    '',
    user?.token
  )
  const {delectDoc} = useDeleteDocuments('product', user?.token)

  console.log(document)

  useEffect(() => {
    if (document) {
      setProducts(document)
    }
  }, [document])

  const handleToggleAvailability = async (
    id: string,
    currentStatus: boolean
  ) => {
    try {
      const updatedStatus = !currentStatus
      await axios.put(
        `${API_URL}/product/${id}`,
        { available: updatedStatus },
        { headers: { Authorization: `${user?.token}` } }
      )

      setProducts((prev) =>
        prev.map((p) => (p._id === id ? { ...p, available: updatedStatus } : p))
      )
    } catch (err) {
      console.error('Erro ao alterar visibilidade:', err)
    }
  }

  const DeleteProduct = (id: string) => {
    const deleta = window.confirm('Tem certeza que quer deletar o produto com id: ' + id)

    if(deleta){
      delectDoc(id)

      setProducts((prev) => prev.filter((item) => item._id !== id))
    } else {
      return
    }
  }

  const categories = [
    'all',
    ...Array.from(
      new Set(products.map((p) => p.category).filter(Boolean))
    ) as string[],
  ]

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
    const matchesCategory =
      selectedCategory === 'all' || p.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-zinc-100 text-black pb-16">
      <DashboardNav title="Gestão do Cardápio" />

      <main className="max-w-7xl mx-auto px-4 mt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-black text-black">
              Produtos ({products.length})
            </h2>
            <p className="text-xs text-zinc-500">
              Cadastre, edite ou pause itens do seu cardápio em tempo real.
            </p>
          </div>

          <button
            onClick={() => {navigate('/dashboard/create')}}
            className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2.5 rounded-xl shadow-xs transition-colors text-sm shrink-0"
          >
            <FaPlus />
            <span>Novo Produto</span>
          </button>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-3 mb-6">
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Buscar por nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-zinc-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-medium text-black placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <FaMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 text-xs" />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize whitespace-nowrap transition-all border ${
                  selectedCategory === cat
                    ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs'
                    : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50'
                }`}
              >
                {cat === 'all' ? 'Todas Categorias' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Listagem de Cards */}
        {loading ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-zinc-200">
            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-xs font-bold text-zinc-400">
              Carregando produtos...
            </p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-zinc-200">
            <FaUtensils className="text-3xl text-zinc-300 mx-auto mb-3" />
            <p className="text-base font-bold text-black">
              Nenhum produto encontrado
            </p>
            <p className="text-xs text-zinc-400">
              Tente mudar a busca ou cadastre um novo item.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((prod) => (
              <ProductCard
                key={prod._id}
                product={prod}
                onEdit={() => navigate(`/dashboard/${prod._id}`)}
                onDelete={() => DeleteProduct(prod._id)}
                onToggleAvailability={handleToggleAvailability}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default DashboardProducts