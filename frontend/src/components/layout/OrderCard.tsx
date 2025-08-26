import React from "react"
import type { Order } from "../../types/OrderTypes"

interface Props {
  order: Order,
  simulatePayment: (id: string) => void
}

export const OrderCard: React.FC<Props> = ({ order, simulatePayment }) => {
  const date = new Date(order.createdAt).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <div className="bg-white shadow-md rounded-2xl p-4 w-full max-w-md border border-gray-200">
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-bold text-lg text-gray-800">
          Pedido #{order._id.slice(-6)}
        </h2>
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${ order.paymentStatus === 'pending' || order.ProductStatus === 'shipped' ? 
            'bg-blue-200 text-blue-600' 
            : order.ProductStatus === "delivered" || order.ProductStatus === 'processing'
              ? "bg-green-100 text-green-700"
              : order.ProductStatus === 'cancelled' ? 'bg-red-200 text-red-600' 
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {order.ProductStatus === 'delivered' ? 'Entregue' : 
          order.ProductStatus === 'cancelled' ? 'Cancelado' :
          order.ProductStatus === 'processing' ? 'Processando' :
          order.ProductStatus === 'shipped' ? 'Em rota de entrega' :
          order.paymentStatus === 'pending' ? 'Aguardando Pagamento' : 'Pendente' }
        </span>
      </div>

      <p className="text-sm text-gray-500 ">Pedido em: {date}</p> 
      <p className="text-sm text-gray-500 mb-2">Ultima atualização: {new Date(order.updatedAt).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })}</p> 

      <div className="mb-3">
        <p className="text-sm font-semibold text-gray-700">Endereço:</p>
        {order.address ? <p className="text-sm text-gray-600">
          {order.address.rua}, {order.address.complemento} - {order.address.bairro}{" "}
          {order.address.cidade} - CEP {order.address.cep}
        </p> : <p className="text-black">Endereço Removido</p>}
      </div>

      <div className="mb-3">
        <p className="text-sm font-semibold text-gray-700">Produtos:</p>
        <ul className="mt-1 space-y-1">
          {order.products.map((p) => (
            <li
              key={p._id}
              className="flex justify-between text-sm text-gray-600"
            >
              <span>
                {p.quantity}x {p.name}
              </span>
              <span>
                R$ {(p.priceAtTimeOfPurchase * p.quantity).toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex justify-between items-center border-t pt-3">
        <p className="text-sm font-medium text-gray-700">
          Pagamento:{" "}
          <span className="capitalize">{order.paymentMethod}</span> (
          {order.paymentStatus})
        </p>
        <p className="font-bold text-lg text-gray-900">
          Total: R$ {order.totalPrice.toFixed(2)}
        </p>
      </div>
      {order.paymentStatus === 'pending' && <button className="bg-orange-600 px-4 rounded py-1" onClick={() => simulatePayment(order._id)} >Simular pagamento</button>}
    </div>
  )
}
