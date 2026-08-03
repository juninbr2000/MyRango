import React from "react"
import type { Order } from "../../types/OrderTypes"
import { FaCheck, FaChevronRight, FaClock, FaMotorcycle, FaSpinner } from "react-icons/fa"
import { Link } from "react-router-dom"
import { FaXmark } from "react-icons/fa6"

interface Props {
  order: Order,
  dashboard?: boolean,
  productStatus?: (id: string, status: string) => void
}

export const OrderCard: React.FC<Props> = ({ order }) => {
  const date = new Date(order.createdAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
  })

  const orderTime = new Date(order.createdAt).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  })

  const deliveredTime = order.updatedAt
    ? new Date(order.updatedAt).toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '--:--'

  // Formatação customizada dos badges de status
  const getStatusBadge = (status: Order['ProductStatus']) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-600 border border-amber-200/60">
            <FaClock className="text-[10px]" />
            Pendente
          </span>
        )
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-50 text-orange-600 border border-orange-200/60">
            <FaSpinner className="text-[10px] animate-spin" />
            Em Preparo
          </span>
        )
      case 'shipped':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-200/60">
            <FaMotorcycle className="text-[11px]" />
            Saiu p/ Entrega
          </span>
        )
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-200/60">
            <FaCheck className="text-[10px]" />
            Entregue
          </span>
        )
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-600 border border-rose-200/60">
            <FaXmark className="text-[10px]" />
            Cancelado
          </span>
        )
    }
  }

  return (
    <Link
      to={`/order/${order._id}`}
      className="group bg-white rounded-2xl p-4 md:p-5 shadow-xs border border-zinc-200/80 hover:border-orange-200 hover:shadow-md transition-all flex flex-col justify-between"
    >
      <div>
        {/* Topo do Card: Data e Total */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-zinc-400 capitalize">
            {date}
          </span>
          <span className="text-base font-black text-orange-500">
            {order.totalPrice.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })}
          </span>
        </div>

        {/* ID do Pedido */}
        <p className="font-mono text-xs text-zinc-400 truncate">
          #{order._id}
        </p>
      </div>

      {/* Rodapé do Card: Horário, Status e Seta */}
      <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-600">
          <FaClock className="text-orange-400 text-xs" />
          <span>{orderTime}</span>
          <span className="text-zinc-300">•</span>
          <span className="text-zinc-400 font-medium">{deliveredTime}</span>
        </div>

        <div className="flex items-center gap-2">
          {getStatusBadge(order.ProductStatus)}
          <FaChevronRight className="text-xs text-zinc-300 group-hover:text-orange-500 group-hover:translate-x-0.5 transition-all" />
        </div>
      </div>
    </Link>
  )
}
