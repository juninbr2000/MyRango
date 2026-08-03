import { useEffect, useState } from 'react'
import { useFetchDocuments } from '../../Hooks/usefetchDocuments'
import { useAuth } from '../../context/authContext'
import type { Order } from '../../types/OrderTypes'
import axios from 'axios'
import DashboardNav from '../../components/layout/DashboardNav'
import { FaBagShopping, FaXmark } from 'react-icons/fa6'
import { FaChevronDown, FaClock, FaDollarSign, FaEye, FaMotorcycle, FaSpinner } from 'react-icons/fa'
import { useDashboardSocket } from '../../Hooks/useDashboardsocket'

const API_URL = import.meta.env.VITE_API_URL;

function Dashboard() {
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedFilter, setSelectedFilter] = useState<string>('all')
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null)
  
  const { user } = useAuth()
  const { document, loading } = useFetchDocuments<Order[]>('order/all', '', user?.token)

  useEffect(() => {
    if (document) {
      setOrders(document)
    }
  }, [document])

  useDashboardSocket({
  onNewOrder: (newOrder) => {
    setOrders((prev) => [newOrder, ...prev])
  },

  onOrderUpdated: (updatedOrder) => {
    setOrders((prev) =>
      prev.map((o) => (o._id === updatedOrder._id ? updatedOrder : o))
    )
  },
})

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await axios.put(
        `${API_URL}order/${id}`,
        { ProductStatus: newStatus },
        { headers: { Authorization: `${user?.token}` } }
      )

      setOrders((prev) =>
        prev.map((o) => (o._id === id ? { ...o, ProductStatus: newStatus as any } : o))
      )
    } catch (error: any) {
      console.error('Erro ao atualizar status:', error)
    }
  }

  // Cálculos dos KPIs
  const totalRevenue = orders
    .filter((o) => o.ProductStatus !== 'canceled')
    .reduce((acc, curr) => acc + curr.totalPrice, 0)

  const pendingCount = orders.filter((o) => o.ProductStatus === 'pending').length
  const processingCount = orders.filter((o) => o.ProductStatus === 'processing').length
  const shippedCount = orders.filter((o) => o.ProductStatus === 'shipped').length

  // Filtragem
  const filteredOrders = orders.filter((order) => {
    if (selectedFilter === 'all') return true
    return order.ProductStatus === selectedFilter
  })

  return (
    <div className="min-h-screen bg-zinc-100 text-black pb-12">
      <DashboardNav title="Gerenciamento de Pedidos e Cozinha" />

      <main className="max-w-7xl mx-auto px-4 mt-6">
        {/* CARDS DE RESUMO (KPIs) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
          <div className="bg-white rounded-2xl p-4 border border-zinc-200/80 shadow-xs">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Faturamento</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <FaDollarSign />
              </div>
            </div>
            <p className="text-xl md:text-2xl font-black text-black">
              {totalRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-zinc-200/80 shadow-xs">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Pendentes</span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <FaClock />
              </div>
            </div>
            <p className="text-xl md:text-2xl font-black text-amber-600">{pendingCount}</p>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-zinc-200/80 shadow-xs">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Em Preparo</span>
              <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                <FaSpinner className="animate-spin" />
              </div>
            </div>
            <p className="text-xl md:text-2xl font-black text-orange-500">{processingCount}</p>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-zinc-200/80 shadow-xs">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Em Entrega</span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <FaMotorcycle />
              </div>
            </div>
            <p className="text-xl md:text-2xl font-black text-blue-600">{shippedCount}</p>
          </div>
        </div>

        {/* BARRA DE FILTROS */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none">
          {[
            { id: 'all', label: 'Todos' },
            { id: 'pending', label: 'Pendentes' },
            { id: 'processing', label: 'Em Preparo' },
            { id: 'shipped', label: 'Saiu p/ Entrega' },
            { id: 'delivered', label: 'Entregues' },
            { id: 'cancelled', label: 'Cancelados' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                selectedFilter === tab.id
                  ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs'
                  : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* LISTA DE PEDIDOS */}
        {loading ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-zinc-200">
            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-xs font-bold text-zinc-400">Carregando pedidos do sistema...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-zinc-200">
            <FaBagShopping className="text-3xl text-zinc-300 mx-auto mb-3" />
            <p className="text-base font-bold text-black">Nenhum pedido encontrado</p>
            <p className="text-xs text-zinc-400">Não há registros para o filtro selecionado.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs flex flex-col justify-between hover:border-zinc-300 transition-all"
              >
                <div>
                  {/* Topo do Card */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs font-extrabold text-zinc-400">
                      #{order._id.slice(-6)}
                    </span>
                    <span className="text-xs font-bold text-zinc-500">
                      {new Date(order.createdAt).toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  {/* Itens Principais */}
                  <div className="space-y-1.5 mb-4 bg-zinc-50 p-3 rounded-xl border border-zinc-100">
                    {order.products.map((p) => (
                      <div key={p._id} className="text-xs flex justify-between font-medium text-zinc-700">
                        <span>
                          <strong className="text-orange-500">{p.quantity}x</strong> {p.name}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Endereço Resumido */}
                  <p className="text-xs text-zinc-500 truncate mb-4">
                    📍 {order.address.rua}, {order.address.complemento || 'S/N'} - {order.address.bairro}
                  </p>
                </div>

                {/* Rodapé e Alteração de Status */}
                <div className="pt-3 border-t border-zinc-100 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-zinc-400 block uppercase">Total</span>
                    <span className="text-base font-extrabold text-black">
                      {order.totalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>

                  {/* Select Personalizado de Status */}
                  <div className="relative">
                    <select
                      value={order.ProductStatus}
                      onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                      className={`appearance-none pl-3 pr-7 py-1.5 rounded-xl text-xs font-extrabold border outline-none cursor-pointer transition-all ${
                        order.ProductStatus === 'pending'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : order.ProductStatus === 'processing'
                          ? 'bg-orange-50 text-orange-700 border-orange-200'
                          : order.ProductStatus === 'shipped'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : order.ProductStatus === 'delivered'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}
                    >
                      <option value="pending">Pendente</option>
                      <option value="processing">Em Preparo</option>
                      <option value="shipped">Saiu p/ Entrega</option>
                      <option value="delivered">Entregue</option>
                      <option value="cancelled">Cancelado</option>
                    </select>
                    <FaChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] pointer-events-none opacity-60" />
                  </div>

                  <button
                    onClick={() => setSelectedOrderDetails(order)}
                    className="p-2 text-zinc-400 hover:text-black hover:bg-zinc-100 rounded-lg transition-colors"
                    title="Ver detalhes"
                  >
                    <FaEye />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* MODAL DE DETALHES DO PEDIDO */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-extrabold text-lg">
                Pedido #{selectedOrderDetails._id}
              </h3>
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="p-2 text-zinc-400 hover:text-black"
              >
                <FaXmark />
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div>
                <p className="text-xs font-bold text-zinc-400 uppercase">Cliente / Endereço</p>
                <p className="font-medium text-zinc-800">
                  {selectedOrderDetails.address.rua}, {selectedOrderDetails.address.complemento}
                </p>
                <p className="text-xs text-zinc-500">
                  {selectedOrderDetails.address.bairro} - {selectedOrderDetails.address.cidade}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold text-zinc-400 uppercase mb-2">Itens</p>
                <div className="space-y-2 border-y border-zinc-100 py-2">
                  {selectedOrderDetails.products.map((item) => (
                    <div key={item._id} className="flex justify-between">
                      <span>
                        <strong>{item.quantity}x</strong> {item.name}
                      </span>
                      <span className="font-bold">
                        {(item.priceAtTimeOfPurchase * item.quantity).toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center font-bold text-base pt-2">
                <span>Total:</span>
                <span className="text-orange-500">
                  {selectedOrderDetails.totalPrice.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard