import React from "react"
import type { Order } from "../../types/OrderTypes"
import { FaClock } from "react-icons/fa"
import { Link } from "react-router-dom"

interface Props {
  order: Order,
  simulatePayment: (id: string) => void,
  dashboard?: boolean,
  productStatus?: (id: string, status: string) => void
}

export const OrderCard: React.FC<Props> = ({ order }) => {


  const date = new Date(order.createdAt).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  })
  const OrderTime = new Date(order.createdAt).toLocaleTimeString('pt-br', {
    hour: '2-digit',
    minute: '2-digit'
  })
  const deliveredTime = order.updatedAt ? (
    new Date(order.updatedAt).toLocaleTimeString('pt-br', {
      hour: '2-digit',
      minute: '2-digit'
    })
  ) : '--:--'

  const ProductStatus = order.ProductStatus === 'pending' ? (
    <p className="text-start block text-xs font-bold px-5 rounded py-2 bg-yellow-100 text-yellow-500">Pendente</p>
  ) : order.ProductStatus === 'processing' ? (
    <p className="text-start block text-xs font-bold px-5 rounded py-2 bg-orange-100 text-orange-500">Processando</p>
  ) : order.ProductStatus === 'shipped' ? (
    <p className="text-start block text-xs font-bold px-5 rounded py-2 bg-blue-200 text-blue-600">Enviado</p>
  ) : order.ProductStatus === 'delivered' ? (
    <p className="text-start block text-xs font-bold px-5 rounded py-2 bg-green-100 text-green-500">Entregue</p>
  ) : (
    <p className="text-start block text-xs font-bold px-5 rounded py-2 bg-red-100 text-red-500">Cancelado</p>
  )

  return (
    <Link to={`/order/${order._id}`} className="bg-white shadow-md rounded-2xl p-4 w-full max-w-md border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <p className="text-zinc-500 font-bold">{date}</p>
        <p className="text-orange-500 font-bold ">{order.totalPrice.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'})}</p>
      </div>
      <p className="font-medium text-xs text-zinc-400 text-start">#{order._id}</p>
      <div className="flex justify-between items-center mt-4">
        <p className="font-bold text-orange-500 flex text-sm items-center gap-2"><FaClock /> {OrderTime} - {deliveredTime}</p>

        {ProductStatus}
      </div>
    </Link>
  )
}
