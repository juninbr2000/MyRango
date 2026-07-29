import { useEffect, useState } from 'react'
import Navbar from '../../components/layout/Navbar'
import { useFetchDocuments } from '../../Hooks/usefetchDocuments'
import CardItem from '../../components/layout/CardItem'
import type { ProductFullData } from '../../types/ProductsTypes'
import { useDocumentStorage } from '../../Hooks/useDocumentStorage'
import { MdDeliveryDining, MdOutlineShoppingCart } from 'react-icons/md'
import { Link } from 'react-router-dom'
import { FaClock } from 'react-icons/fa'
import { FaMagnifyingGlass } from 'react-icons/fa6'

function Home() {
  const [products, setProducts] = useState<ProductFullData[] | null>(null)
  const [search, setSearch] = useState('')

  const { docs } = useDocumentStorage('cart')
  const { loading, error, document } = useFetchDocuments<ProductFullData[]>('product')

  useEffect(() => {
    setProducts(document)
  }, [document, loading, error])

  const filteredProducts = products?.filter((pr) =>
    pr.title.toLowerCase().includes(search.toLowerCase())
  )

  const groupedProducts = filteredProducts?.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }

    acc[product.category].push(product);

    return acc;
  }, {} as Record<string, ProductFullData[]>);

  return (
    <div className="min-h-screen bg-zinc-200 text-black pb-24">
      <Navbar />

      <div className="card relative mt-16 bg-gradient-to-br from-zinc-900 via-zinc-800 to-black text-white px-6 pt-20 pb-16 rounded-b-3xl shadow-md">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center">

          <span className="bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wider">
            Promoção Especiais
          </span>

          <h1 className="font-extrabold text-3xl md:text-5xl tracking-tight leading-tight">
            Fim de semana com <br className="hidden sm:block" />
            <span className="text-orange-500">Entrega Grátis!</span>
          </h1>

          <div className="flex items-center justify-center gap-4 mt-6 text-sm">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
              <FaClock className="text-orange-400" />
              <span className="font-semibold text-zinc-200">20 ~ 40 min</span>
            </div>

            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
              <MdDeliveryDining className="text-orange-400 text-lg" />
              <span className="font-semibold text-zinc-200">Entrega Grátis</span>
            </div>
          </div>
        </div>
      </div>

      {/* Seção Principal / Cardápio */}
      <main className="max-w-4xl mx-auto px-4 -mt-6 relative z-10">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-zinc-200/80">

          {/* Header da Seção + Busca */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="font-extrabold text-2xl md:text-3xl text-black">
                Nosso Cardápio
              </h2>
              <p className="text-zinc-500 text-sm mt-0.5">
                Escolha seu lanche favorito e faça o seu pedido
              </p>
            </div>

            {/* Input de Pesquisa */}
            <div className="relative w-full md:w-64">
              <FaMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 text-sm" />
              <input
                type="text"
                placeholder="Buscar lanche..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-zinc-100 rounded-xl text-sm border border-zinc-200 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
              />
            </div>
          </div>

          {/* Categoria: Lanches */}
          <div className="pt-2">

            {/* Lista de Produtos em Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {groupedProducts &&
                Object.entries(groupedProducts).map(([category, products]) => (
                  <div key={category} className="border-t border-zinc-100 pt-6 mb-8">
                    <div className="mb-4">
                      <h3 className="text-xl capitalize font-extrabold text-orange-500">
                        {category}
                      </h3>

                      <p className="text-xs text-zinc-400">
                        {products.length} itens disponíveis
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {products.map((pr) => (
                        <CardItem
                          key={pr._id}
                          _id={pr._id}
                          title={pr.title}
                          description={pr.description}
                          price={pr.price}
                          imageUrl={pr.imageUrl}
                        />
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </main>

      {/* Botão Flutuante do Carrinho */}
      <Link
        to="/cart"
        aria-label="Carrinho"
        className="fixed z-40 right-6 bottom-8 bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-full shadow-xl transition-all active:scale-95 flex items-center justify-center"
      >
        <MdOutlineShoppingCart className="text-2xl" />
        {docs && docs.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-zinc-900 text-white text-xs font-black w-6 h-6 rounded-full border-2 border-white flex items-center justify-center shadow-md animate-scale-in">
            {docs.length}
          </span>
        )}
      </Link>
    </div>
  )
}

export default Home