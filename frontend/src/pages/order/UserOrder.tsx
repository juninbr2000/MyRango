import { useEffect, useState } from 'react'
import { useFetchDocuments } from '../../Hooks/usefetchDocuments'
import { useAuth } from '../../context/authContext'
import Navbar from '../../components/layout/Navbar'
import { OrderCard } from '../../components/layout/OrderCard'
import type { Order } from '../../types/OrderTypes'
import { socket } from '../../services/Socket'

function UserOrder() {
  const { user } = useAuth()
  const { document, loading } = useFetchDocuments<Order[]>('order', '', user?.token)

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
      socket.emit("join-order", o._id)
    );

    return () => {
      activeOrders.forEach(o =>
        socket.emit("leave-order", o._id)
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
      <div className='min-h-screen w-screen bg-zinc-200 flex items-center justify-center'>
        <div className="w-10 h-10 border-4 border-t-orange-400 border-gray-300 rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className='bg-zinc-200 max-w-screen min-h-screen pt-16 '>
      <Navbar />

      {document && (<div className='flex flex-col gap-2 p-4'>
        <h1 className='font-semibold text-black text-start text-2xl mb-2'>Meus Pedidos</h1>

        <div className='flex flex-wrap justify-around gap-2'>
          {order && order.map((item: any) => (
            <OrderCard order={item} />
          ))}
        </div>

        {order.length > 1 && <p className='text-sm font-semibold text-zinc-700 p-8'>Uau!! já são {order.length} Pedidos</p>}
        {!order || order.length === 0 && <p className='text-sm font-semibold text-zinc-700 p-8'> Você ainda não tem nenhum pedido</p>}
      </div>)}
    </div>
  )
}

export default UserOrder