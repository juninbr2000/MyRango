import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../context/authContext'
import { useFetchDocuments } from '../../Hooks/usefetchDocuments'
import type { Order } from '../../types/OrderTypes'
import Navbar from '../../components/layout/Navbar'
import MainButton from '../../components/ui/MainButton'
import { FaCheckCircle, FaRegCopy } from 'react-icons/fa'
import axios from 'axios'
import { useOrderSocket } from '../../Hooks/useOrderSocket'

const URL = import.meta.env.VITE_API_URL

function PaymentPage() {

  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()

  const {document, loading} = useFetchDocuments<Order>('order', id, user?.token)

  console.log(document)
  
  const [order, setOrder] = useState<Order>()
  const [copied, setCopied] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    if(document){
      setOrder(document)
    }
  }, [document])

  const handlePaymentSuccess = (updatedOrder?: Order) => {
    setOrder((prev) => (prev ? { ...prev, paymentStatus: 'paid' } : updatedOrder))

    setTimeout(() => {
      navigate(`/order/${id}`)
    }, 2500)
  }

  const handleCopyPix = () => {
    navigator.clipboard.writeText("00020126580014BR.GOV.BCB.PIX0136123e4567-e89b-12d3-a456-426614174000520400005303986540510.005802BR5913ImoveisDelivery6008BRASILIA62070503***6304E2CA")
    setCopied(true)
    setTimeout(() => setCopied(false), 3000)
  }

  useOrderSocket(id, (updatedOrder) => {
    handlePaymentSuccess(updatedOrder)
  })

  const handleConfirmPayment = async () => {
    if (!id || isProcessing) return
    setIsProcessing(true)

    try {
      await axios.put(
        `${URL}order/pay/${id}`,
        { paymentStatus: 'paid' },
        { headers: { Authorization: user?.token } }
      )

      handlePaymentSuccess()
    } catch (error) {
      console.error('Erro ao processar pagamento:', error)
      alert('Erro ao processar o pagamento. Tente novamente.')
      setIsProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen w-screen bg-zinc-200 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-t-orange-500 border-gray-300 rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-zinc-200 pt-20 px-4 text-center">
        <Navbar />
        <div className='flex flex-col gap-10 items-center justify-center mt-10'>
          <h2 className="text-2xl font-bold text-black mt-10">Pedido não encontrado!</h2>
          <MainButton
            title='Voltar para meus pedidos' 
            onPress={() => navigate('/orders')}
            classe='primary'
            type='button'
            />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-200 pt-16 pb-12">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 mt-6">
        {/* Card Principal */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          
          {/* Header do Pagamento */}
          <div className="border-b border-zinc-100 pb-4 mb-6 text-center">
            <span className="text-xs uppercase tracking-wider font-semibold text-zinc-400">
              Pedido #{order._id.slice(-6)}
            </span>
            <h1 className="text-2xl font-bold text-black mt-1">Pagamento do Pedido</h1>
            <p className="text-3xl font-extrabold text-orange-500 mt-2">
              {order.totalPrice?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
          </div>

          {/* SE O PEDIDO JÁ FOI PAGO */}
          {order.paymentStatus === 'paid' ? (
            <div className="flex flex-col items-center justify-center py-10 text-center animate-fade-in">
              {/* Ícone com animação de Bounce e Scale */}
              <div className="relative flex items-center justify-center mb-4">
                <div className="absolute w-20 h-20 bg-green-100 rounded-full animate-ping opacity-75"></div>
                <FaCheckCircle className="text-7xl text-green-500 relative z-10 animate-bounce" />
              </div>

              <h2 className="text-2xl font-bold text-black mt-2">Pagamento Confirmado!</h2>
              <p className="text-zinc-500 mt-2 max-w-sm">
                Seu pedido foi aprovado e já enviado para a cozinha!
              </p>

              {/* Indicador de Redirecionamento Automático */}
              <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-orange-500">
                <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                <span>Redirecionando para os detalhes do pedido...</span>
              </div>
            </div>
          ) : (
            <>
              {/* Opção PIX */}
              {order.paymentMethod === 'pix' && (
                <div className="flex flex-col items-center bg-zinc-50 p-6 rounded-2xl border border-zinc-200/80">
                  <p className="text-sm text-zinc-600 mb-4 text-center">
                    Escaneie o QR Code abaixo ou copie a chave Pix para realizar o pagamento.
                  </p>

                  <div className="bg-white p-3 rounded-xl border border-zinc-200 shadow-sm mb-4">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=PagamentoPedido_${order._id}`}
                      alt="QR Code Pix"
                      className="w-44 h-44"
                    />
                  </div>

                  <button
                    onClick={handleCopyPix}
                    className="flex items-center gap-2 bg-white hover:bg-zinc-100 text-zinc-700 font-medium px-4 py-2.5 rounded-lg border border-zinc-300 transition-colors text-sm w-full justify-center"
                  >
                    <FaRegCopy /> {copied ? 'Copiado com Sucesso!' : 'Copiar Código Pix'}
                  </button>
                </div>
              )}

              {/* Opção Cartão de Crédito */}
              {order.paymentMethod === 'credit_card' && (
                <div className="space-y-3 bg-zinc-50 p-4 rounded-2xl border border-zinc-200/80">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-600 mb-1">
                      Número do Cartão
                    </label>
                    <input
                      type="text"
                      placeholder="0000 0000 0000 0000"
                      className="text-black w-full p-3 rounded-lg border border-zinc-300 text-sm focus:outline-orange-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-600 mb-1">
                        Validade
                      </label>
                      <input
                        type="text"
                        placeholder="MM/AA"
                        className="text-black w-full p-3 rounded-lg border border-zinc-300 text-sm focus:outline-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-600 mb-1">CVV</label>
                      <input
                        type="text"
                        placeholder="123"
                        className="text-black w-full p-3 rounded-lg border border-zinc-300 text-sm focus:outline-orange-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Botão de Ação / Simular Pagamento */}
              {order.paymentStatus === 'pending' && (
                <div className="flex items-center justify-center mt-6">
                  <MainButton
                    title={isProcessing ? 'Processando...' : 'Simular pagamento'}
                    classe="primary"
                    type="button"
                    onPress={handleConfirmPayment}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
}

export default PaymentPage