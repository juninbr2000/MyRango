import { useFetchDocuments } from '../../Hooks/usefetchDocuments'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../context/authContext'
import type { Order } from '../../types/OrderTypes'
import Navbar from '../../components/layout/Navbar'
import { useEffect, useState } from 'react'
import { socket } from '../../services/Socket'
import { FaArrowLeft, FaClock, FaCreditCard, FaMotorcycle, FaReceipt, FaSpinner } from 'react-icons/fa'
import { FaCircleCheck, FaLocationDot, FaXmark } from 'react-icons/fa6'

function OrderDetails() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()

  const { document, loading, error } = useFetchDocuments<Order>('order', id, user?.token)
  const [order, setOrder] = useState<Order | undefined>()

  useEffect(() => {
    if (document) {
      console.log(document)
      setOrder(document)
    }
  }, [document])

  // Escuta atualizações via WebSocket
  useEffect(() => {
    if (!id) return

    socket.emit('join-order', id)

    const handleStatusChange = (updatedOrder: Order) => {
      setOrder(updatedOrder)
    }

    socket.on('status-changed', handleStatusChange)

    return () => {
      socket.emit('leave-order', id)
      socket.off('status-changed', handleStatusChange)
    }
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen w-screen bg-zinc-200 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-t-orange-500 border-zinc-300 rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-zinc-200 pt-20 px-4 flex flex-col items-center justify-center text-center text-black">
        <Navbar />
        <div className="bg-white rounded-3xl p-8 max-w-sm w-full border border-zinc-200 shadow-sm">
          <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-3 text-xl">
            <FaXmark />
          </div>
          <h2 className="text-xl font-extrabold mb-1">Erro ao carregar pedido</h2>
          <p className="text-xs text-zinc-500 mb-6">{error || 'Pedido não localizado.'}</p>
          <button
            onClick={() => navigate('/order')}
            className="w-full bg-zinc-900 text-white font-bold py-2.5 rounded-xl text-sm hover:bg-black transition-colors"
          >
            Voltar para Pedidos
          </button>
        </div>
      </div>
    )
  }

  const orderAt = new Date(order.createdAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
  const orderTime = new Date(order.createdAt).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  })
  const updatedTime = order.updatedAt
    ? new Date(order.updatedAt).toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '--:--'

  // Renderizador dos Badges de Status
  const renderStatusHeader = () => {
    switch (order.ProductStatus) {
      case 'pending':
        return {
          label: 'Aguardando confirmação',
          color: 'bg-amber-50 text-amber-700 border-amber-200',
          icon: <FaClock className="text-amber-500" />,
        }
      case 'processing':
        return {
          label: 'Sendo preparado',
          color: 'bg-orange-50 text-orange-700 border-orange-200',
          icon: <FaSpinner className="text-orange-500 animate-spin" />,
        }
      case 'shipped':
        return {
          label: 'Saiu para entrega',
          color: 'bg-blue-50 text-blue-700 border-blue-200',
          icon: <FaMotorcycle className="text-blue-500" />,
        }
      case 'delivered':
        return {
          label: 'Pedido Entregue',
          color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          icon: <FaCircleCheck className="text-emerald-500" />,
        }
      default:
        return {
          label: 'Pedido Cancelado',
          color: 'bg-rose-50 text-rose-700 border-rose-200',
          icon: <FaXmark className="text-rose-500" />,
        }
    }
  }

  const statusInfo = renderStatusHeader()

  return (
    <div className="min-h-screen bg-zinc-200 text-black pt-16 pb-16">
      <Navbar />

      <main className="max-w-xl mx-auto px-4 mt-6">
        {/* Topo / Voltar */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate('/order')}
            className="flex items-center gap-2 text-xs font-bold text-zinc-600 hover:text-black bg-white px-3 py-2 rounded-xl border border-zinc-200/80 shadow-xs transition-colors"
          >
            <FaArrowLeft />
            <span>Voltar para meus pedidos</span>
          </button>

          <span className="text-[10px] font-mono font-bold text-zinc-400 bg-zinc-300/60 px-2 py-1 rounded">
            LIVE SOCKET ACTIVE
          </span>
        </div>

        {/* CONTAINER "NOTA FISCAL / CUPOM" */}
        <div className="bg-white rounded-3xl shadow-md border border-zinc-200/80 overflow-hidden relative">
          
          {/* Header da Nota */}
          <div className="p-6 bg-gradient-to-b from-zinc-50 to-white border-b border-dashed border-zinc-200">
          {/* Status do Pedido Badge */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1 mb-5 rounded-full text-xs font-bold border ${statusInfo.color}`}
          >
            {statusInfo.icon}
            <span>{statusInfo.label}</span>
          </div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-orange-500 text-white flex items-center justify-center text-sm font-bold shadow-xs">
                  <FaReceipt />
                </div>
                <div>
                  <h1 className="text-lg font-extrabold text-black leading-none">
                    Comprovante do Pedido
                  </h1>
                  <p className="text-xs font-mono text-zinc-400 mt-0.5">
                    #{order._id}
                  </p>
                </div>
              </div>
            </div>

            {/* Horários */}
            <div className="grid grid-cols-2 gap-2 bg-zinc-100/70 rounded-2xl p-3 text-xs">
              <div>
                <span className="text-zinc-400 block font-medium">Realizado em:</span>
                <span className="font-bold text-zinc-800">
                  {orderAt} às {orderTime}
                </span>
              </div>
              <div className="text-right">
                <span className="text-zinc-400 block font-medium">Última atualização:</span>
                <span className="font-bold text-orange-600">{updatedTime}</span>
              </div>
            </div>
          </div>

          {/* Endereço e Forma de Pagamento */}
          <div className="p-6 border-b border-dashed border-zinc-200 space-y-4">
            {/* Endereço */}
            <div>
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-zinc-400 uppercase tracking-wider mb-2">
                <FaLocationDot className="text-orange-500" />
                <span>Endereço de Entrega</span>
              </div>
              <div className="bg-zinc-50 p-3.5 rounded-2xl border border-zinc-200/60 text-sm">
                <p className="font-bold text-black">
                  {order.address.rua}
                  {order.address.complemento ? `, ${order.address.complemento}` : ''}
                </p>
                <p className="text-xs text-zinc-500 mt-0.5">
                  {order.address.complemento && `${order.address.complemento} • `}
                  {order.address.bairro}, {order.address.cidade}
                </p>
              </div>
            </div>

            {/* Pagamento */}
            <div>
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-zinc-400 uppercase tracking-wider mb-2">
                <FaCreditCard className="text-orange-500" />
                <span>Pagamento</span>
              </div>
              <div className="flex items-center justify-between bg-zinc-50 p-3.5 rounded-2xl border border-zinc-200/60 text-sm">
                <div>
                  <p className="font-bold text-black capitalize">
                    {order.paymentMethod}
                  </p>
                  <p className="text-xs text-zinc-400">Método selecionado</p>
                </div>

                <span
                  className={`text-xs font-extrabold px-2.5 py-1 rounded-lg ${
                    order.paymentStatus === 'paid'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {order.paymentStatus === 'paid' ? 'Pago' : 'Pendente na Entrega'}
                </span>
              </div>
            </div>
          </div>

          {/* Itens do Pedido */}
          <div className="p-6">
            <h3 className="text-xs font-extrabold text-zinc-400 uppercase tracking-wider mb-4">
              Itens Solicitados
            </h3>

            <div className="space-y-3 mb-6">
              {order.products &&
                order.products.map((prod) => (
                  <div
                    key={prod._id}
                    className="flex items-start justify-between text-sm py-1 border-b border-zinc-100 last:border-none"
                  >
                    <div className="flex items-start gap-3">
                      <span className="font-black text-orange-500 text-sm bg-orange-50 px-2 py-0.5 rounded-md">
                        {prod.quantity}x
                      </span>
                      <div>
                        <p className="font-bold text-black leading-tight">
                          {prod.name}
                        </p>
                        {/* {prod.observation && (
                          <p className="text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded mt-1 border border-amber-200/50 inline-block">
                            Obs: {prod.observation}
                          </p>
                        )} */}
                      </div>
                    </div>

                    <span className="font-bold text-zinc-800 shrink-0">
                      {(
                        prod.priceAtTimeOfPurchase * prod.quantity
                      ).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </span>
                  </div>
                ))}
            </div>

            {/* Total / Rodapé do Cupom */}
            <div className="pt-4 border-t-2 border-zinc-900 flex justify-between items-center">
              <div>
                <span className="text-xs font-bold text-zinc-400 uppercase block">
                  Valor Total
                </span>
              </div>
              <span className="text-2xl font-black text-orange-500">
                {order.totalPrice.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </span>
            </div>
          </div>

          {/* Borda Decorativa Serrilhada / Rodapé */}
          <div className="bg-zinc-100 p-4 text-center border-t border-zinc-200">
            <p className="text-[11px] font-medium text-zinc-400">
              Obrigado por comprar no <strong className="text-zinc-600">myRango</strong>!
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default OrderDetails