import { useEffect, useState } from 'react'
import Navbar from '../../components/layout/Navbar'
import { useFetchDocuments } from '../../Hooks/usefetchDocuments'
import { useAuth } from '../../context/authContext'
import { OrderCard } from '../../components/layout/OrderCard'
import type { Order } from '../../types/OrderTypes'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL;

function Dashboard() {
    const [orders, setOrder] = useState<Order[]>([])
    const {user} = useAuth()
    
    const {document, loading} = useFetchDocuments<Order[]>('order/all', '', user?.token)
    
    console.log(document)
    
    useEffect(() => {
      if(document){
        setOrder(document)
      }
    }, [document])
    
    const ProductStatus = async (id: string, status: string) => {
      try{
        await axios.put(`${API_URL}order/${id}`, {ProductStatus: status}, {headers: {Authorization: user?.token}})

        setOrder((prev) =>
          prev.map((o) => (o._id === id ? { ...o, ProductStatus: status } : o))
      );
    } catch(error: any){
      console.error(error)
    }
  }
  
  return (
    <div className="min-h-screen max-w-screen bg-zinc-200 pt-16">
        <Navbar />

        <div className='flex flex-col gap-2 p-4'>
            <h1 className='font-semibold text-black text-start text-2xl mb-2'>Pedidos</h1>
            <div className='flex flex-col items-center justify-center gap-4'>
                {orders && orders.map((ord: any) => (
                    <OrderCard order={ord} simulatePayment={()=>{}} dashboard={true} productStatus={ProductStatus}/>
                ))}

            </div>
        </div>
    </div>
  )
}

export default Dashboard