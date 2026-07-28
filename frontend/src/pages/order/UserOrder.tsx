import { useEffect, useState } from 'react'
import { useFetchDocuments } from '../../Hooks/usefetchDocuments'
import { useAuth } from '../../context/authContext'
import Navbar from '../../components/layout/Navbar'
import { OrderCard } from '../../components/layout/OrderCard'
import type { Order } from '../../types/OrderTypes'
import { socket } from '../../services/Socket'
import MainButton from '../../components/ui/MainButton'
import { FaBagShopping } from 'react-icons/fa6'
import { FaArrowLeft } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

function UserOrder() {
  const { user } = useAuth()
  const { document, loading } = useFetchDocuments<Order[]>('order', '', user?.token)
  const navigate = useNavigate()

  const [order, setOrder] = useState<Order[]>([])

  useEffect(() => {
    if (document) {
      setOrder(document)
    }
  }, [document])

  useEffect(() => {
    if (order.length === 0) return;

    const activeOrders = order.filter(
      o => o.ProductStatus !== "delivered" &&
        o.ProductStatus !== "cancelled"
    );

    activeOrders.forEach(o =>
      socket.emit("join-room", `order-${o._id}`)
    );

    return () => {
      activeOrders.forEach(o =>
        socket.emit("leave-room", `order-${o._id}`)
      );
    };
  }, [document]);

  useEffect(() => {
    const handleStatusChanged = (updatedOrder: Order) => {
      setOrder(prev =>
        prev.map(o =>
          o._id === updatedOrder._id
            ? updatedOrder
            : o
        )
      );
    };

    socket.on("status-changed", handleStatusChanged);

    return () => {
      socket.off("status-changed", handleStatusChanged);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen w-screen bg-zinc-200 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-t-orange-500 border-zinc-300 rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-200 text-black pt-16 pb-12">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 mt-6">
        {/* Header da Página */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate('/')}
            className="p-2 bg-white rounded-xl text-zinc-600 hover:text-black hover:bg-zinc-100 transition-colors shadow-xs"
            aria-label="Voltar ao Início"
          >
            <FaArrowLeft />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-black">
              Meus Pedidos
            </h1>
            <p className="text-xs text-zinc-500">
              Acompanhe o status das suas compras
            </p>
          </div>
        </div>

        {/* Lista de Pedidos */}
        {order && order.length > 0 ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {order.map((item) => (
                <OrderCard key={item._id} order={item} />
              ))}
            </div>

            {/* Contador de Pedidos */}
            {order.length > 1 && (
              <div className="mt-8 p-4 bg-orange-50/80 border border-orange-200/60 rounded-2xl text-center">
                <p className="text-sm font-bold text-orange-800">
                  🎉 Uau!! Você já realizou <span className="text-orange-600 font-extrabold text-base">{order.length}</span> pedidos no myRango!
                </p>
              </div>
            )}
          </div>
        ) : (
          /* Estado Vazio */
          <div className="bg-white rounded-3xl p-8 text-center border border-zinc-200/80 shadow-xs max-w-md mx-auto my-8">
            <div className="w-16 h-16 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
              <FaBagShopping />
            </div>
            <h3 className="text-lg font-bold text-black mb-1">
              Você ainda não fez nenhum pedido
            </h3>
            <p className="text-sm text-zinc-400 mb-6">
              Que tal dar uma olhada no nosso cardápio e pedir algo delicioso hoje?
            </p>
            <MainButton
              title="Ver Cardápio"
              classe="primary"
              type="button"
              onPress={() => navigate('/')}
            />
          </div>
        )}
      </main>
    </div>
  )
}

export default UserOrder