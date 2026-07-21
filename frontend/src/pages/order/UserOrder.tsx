import { useEffect, useState } from 'react'
import { useFetchDocuments } from '../../Hooks/usefetchDocuments'
import { useAuth } from '../../context/authContext'
import Navbar from '../../components/layout/Navbar'
import { OrderCard } from '../../components/layout/OrderCard'
import type { Order } from '../../types/OrderTypes'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL;

function UserOrder() {
    const {user} = useAuth()
    const {document, loading} = useFetchDocuments<Order[]>('order', '', user?.token)
    
    const [order, setOrder] = useState<Order[]>([])
    
    console.log(document)

    useEffect(() => {
      if(document){
        setOrder(document)
      }
    }, [document])
    
    useEffect(() => { 
      BuscarPedido() 

      const SearchOrder = setInterval(() => {
        BuscarPedido()
      }, 5000)

      return () => clearInterval(SearchOrder)
    }, [])

    const BuscarPedido = async () => {
      try {
        const data = await axios.get(`${API_URL}order/`, {headers: {Authorization: user?.token}})

        console.log(data.data)
        setOrder(data.data)
      } catch ( error ){
        console.error(error)
      }
    } 

    if(loading){
      return (
        <div className='min-h-screen w-screen bg-zinc-200 flex items-center justify-center'>
          <div className="w-10 h-10 border-4 border-t-orange-400 border-gray-300 rounded-full animate-spin"></div>
        </div>
      )
    }

    const handlePayment = async (id: string) => {
      try{
        await axios.put(`${API_URL}order/pay/${id}`, {paymentStatus: 'paid'}, {headers: {Authorization: user?.token}})

        setOrder((prev) =>
          prev.map((o) => (o._id === id ? { ...o, paymentStatus: "paid" } : o))
        );
      } catch(error: any){
        console.error(error)
      }
    }
    
  return (
    <div className='bg-zinc-200 max-w-screen min-h-screen pt-16 '>
        <Navbar />

        <div className='flex flex-col gap-2 p-4'>
            <h1 className='font-semibold text-black text-start text-2xl mb-2'>Meus Pedidos</h1>

            <div className='flex flex-wrap justify-around gap-2'>
              {order && order.map((item: any) => (
                <OrderCard order={item} simulatePayment={handlePayment} />
              ))}
            </div>

            {order.length > 1 && <p className='text-sm font-semibold text-zinc-700 p-8'>Uau!! já são {order.length} Pedidos</p>}
            {!order || order.length === 0 && <p className='text-sm font-semibold text-zinc-700 p-8'> Você ainda não tem nenhum pedido</p>}
        </div>
    </div>
  )
}

export default UserOrder