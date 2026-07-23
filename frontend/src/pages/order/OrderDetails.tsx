import { useFetchDocuments } from '../../Hooks/usefetchDocuments'
import { useParams } from 'react-router-dom'
import { useAuth } from '../../context/authContext'
import type { Order } from '../../types/OrderTypes'

function OrderDetails() {
  const { id } = useParams()
  const {user} = useAuth()
  const {document, loading, error} = useFetchDocuments<Order>('order', id, user?.token)

  if(loading){
    return (
      <div className='min-h-screen w-screen bg-zinc-200 flex items-center justify-center'>
        <div className="w-10 h-10 border-4 border-t-orange-400 border-gray-300 rounded-full animate-spin"></div>
      </div>
    )
  }

  if(!document) {
    return (
      <div className='min-h-screen bg-zinc-200 flex flex-col items-center justify-center text-black box-border'>
        <p className='font-bold text-2xl text-red'>Erro ao buscar Dados</p>
        <p className='text-zinc-500 font-sm'>{error}</p>
      </div>
    )
  }
  
  const OrderAt = new Date(document?.createdAt).toLocaleDateString('pt-br', { day: '2-digit', month: 'short', year: 'numeric'})
  const OrderTime = new Date(document?.createdAt).toLocaleTimeString('pt-br', { hour: '2-digit', minute: '2-digit'})
  const updatedTime = new Date(document?.updatedAt).toLocaleTimeString('pt-br', { hour: '2-digit', minute: '2-digit'})

  const ProductStatus = document?.ProductStatus === 'pending' ? (
    <p className="shadow text-start block text-xs font-bold px-5 rounded py-2 bg-yellow-100 text-yellow-500">Pendente</p>
  ) : document?.ProductStatus === 'processing' ? (
    <p className="shadow text-start block text-xs font-bold px-5 rounded py-2 bg-orange-100 text-orange-500">Processando</p>
  ) : document?.ProductStatus === 'shipped' ? (
    <p className="shadow text-start block text-xs font-bold px-5 rounded py-2 bg-blue-200 text-blue-600">Enviado</p>
  ) : document?.ProductStatus === 'delivered' ? (
    <p className="shadow text-start block text-xs font-bold px-5 rounded py-2 bg-green-100 text-green-500">Entregue</p>
  ) : (
    <p className="shadow text-start block text-xs font-bold px-5 rounded py-2 bg-red-100 text-red-500">Cancelado</p>
  )

  return (
    <div className='min-h-screen bg-zinc-200 flex flex-col items-center justify-center text-black box-border'>
      {document && <>
      <div className='w-[90%]'>
        <h2 className='text-4xl font-bold text-start mb-2'>Detalhes do Pedido</h2>
        <p className='text-xs text-zinc-500 text-start'>#{id}</p>
        <div className='flex items-center justify-between mt-4'>
          <p className='text-md font-bold text-zinc-500 mt-4'>{OrderAt}</p>
          {ProductStatus}
        </div>
        <div className='flex flex-col mt-2 px-4 py-6 border-b'>
          <div className='flex justify-between'>
            <p className='text-zinc-500 text-start'>
              Pedido as: 
            </p>
            <span className='text-end font-bold text-orange-500'>{OrderTime}</span>
          </div>
          <div className='flex justify-between'>
            <p className='text-zinc-500 text-start'>Atualizado em:</p>
            <span className='text-end font-bold text-orange-500'>{updatedTime}</span>
          </div>
        </div>
      </div>
      <div className='border-b px-4 py-6 w-[90%]'>
        <div className='mb-5'>
          <h3 className='text-md text-xl font-bold text-zinc-500 text-start'>Endereço:</h3>
          <div className='mt-2'>
            <p className='font-medium text-sm'>{document?.address.rua}, nº {document?.address.complemento}</p>
            <p className='font-medium text-sm'>{document?.address.bairro} - {document?.address.cidade}</p>
          </div>
        </div>
        <div>
          <h3 className='text-md text-xl font-bold text-zinc-500 text-start'>Pagamento:</h3>
          <div className='mt-5'>
            <div className='flex justify-between'>
              <p className=' text-zinc-500'>Metodo de pagamento:</p>
              <span className='text-orange-500 font-semibold'>
                {document?.paymentMethod}
              </span>
            </div>
            <div className='flex justify-between'>
              <p className=' text-zinc-500'>Status do pagamento:</p>
              <span className='text-orange-500 font-semibold'>
                {document?.paymentStatus === 'paid' ? 'Pago' : 'Pendente'}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className='w-[90%] px-4 py-6'>
        <h3 className='text-md text-xl font-bold text-zinc-500 text-start'>Produtos</h3>
        {document && document.products.map((prod) => (
          <div key={prod._id} className='flex justify-between py-2'>
            <div className='flex gap-2 items-center'>
              <span className='font-bold text-orange-500 text-lg'>{prod.quantity}X</span>
              <p className='font-bold text-zinc-500'>{prod.name}</p>
            </div>
            <p className='font-bold'>{(prod.priceAtTimeOfPurchase * prod.quantity).toLocaleString('pt-br', {style: 'currency', currency:'BRL'})}</p>
          </div>
        ))}
        <div className='flex justify-between border-t py-4'>
          <p className='font-bold text-lg text-zinc-500'>Total:</p>
          <p className='font-bold text-orange-500 text-lg'>{document?.totalPrice.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'})}</p>
        </div>
      </div>
      </>}
      {error && (
        <>
          <p className='font-bold text-2xl text-red'>Erro ao buscar Dados</p>
          <p className='text-zinc-500 font-sm'>{error}</p>
        </>
      )}
    </div>
  )
}

export default OrderDetails