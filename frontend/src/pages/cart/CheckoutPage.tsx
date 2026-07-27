import { useEffect, useState } from "react"
import Navbar from "../../components/layout/Navbar" 
import type { Address } from "../../types/AddressTypes"
import { useDocumentStorage } from "../../Hooks/useDocumentStorage"
import { useFetchDocuments } from "../../Hooks/usefetchDocuments"
import { useAuth } from "../../context/authContext"
import type { CartItem } from "../../types/OrderTypes"
import { useNavigate } from "react-router-dom"
import { useCreateDocument } from "../../Hooks/useCreateDocument"
import MainButton from "../../components/ui/MainButton"
import { FaArrowLeft, FaCheck, FaCreditCard, FaMapMarkerAlt, FaPlus } from "react-icons/fa"
import { FaPix } from "react-icons/fa6"

export default function CheckoutPage() {
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null)
  const [paymentMethod, setPaymentMethod] = useState("pix")
  const [addresses, setAddresses] = useState<Address[]>([])
  const [cart, setCart] = useState<CartItem[]>()
  const navigate = useNavigate()
  
  const {user} = useAuth()
  const {docs, clear} = useDocumentStorage('cart')
  const {document ,loading} = useFetchDocuments<Address[]>('Address', user?.user._id, user?.token )
  const { createDoc, loading: loadingCr } = useCreateDocument('order', user?.token || "")

  const total = docs.reduce((sum, item) => sum + item.price * item.amount, 0)

  useEffect(() => {
    if(document){
      setAddresses(document)
    }
    if(docs){
      setCart(docs)
    }
  }, [document, docs])

  const handleFinish = async () => {
    if (!selectedAddress) {
      alert("Selecione um endereço")
      return
    }

    const data ={
      addressId: selectedAddress,
      paymentMethod,
      products: cart!.map((item: any) => ({
        product: item._id,
        quantity: item.amount
      }))
    }
    
    try{
      const res = await createDoc(data)

      if(res){
        clear()
        navigate(`/payment/${res.data._id}`)
      }
    } catch (error) {
      console.error(error)
    }
  }

  if(!loading && cart === undefined){
    navigate('/cart')
  }

  return (
    <div className="bg-zinc-200 min-h-screen text-black pt-16 pb-12">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 mt-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/cart')}
            className="flex items-center gap-2 text-zinc-600 hover:text-black font-medium transition-colors"
          >
            <FaArrowLeft /> Voltar ao Carrinho
          </button>
          <h1 className="text-2xl md:text-3xl font-extrabold text-black">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna da Esquerda: Endereço + Pagamento */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Seção 1: Endereço de Entrega */}
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200/80">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-orange-500 text-xl" />
                  <h2 className="text-xl font-bold text-black">Endereço de Entrega</h2>
                </div>
                {addresses.length > 0 && (
                  <button
                    onClick={() => navigate('/address/create')}
                    className="flex items-center gap-1.5 text-xs font-bold text-orange-500 hover:text-orange-600 bg-orange-50 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <FaPlus /> Novo Endereço
                  </button>
                )}
              </div>

              {addresses.length > 0 ? (
                <div className="grid grid-cols-1 gap-3">
                  {addresses.map((addr) => {
                    const isSelected = selectedAddress === addr._id
                    return (
                      <div
                        key={addr._id}
                        onClick={() => setSelectedAddress(addr._id)}
                        className={`relative flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          isSelected
                            ? 'border-orange-500 bg-orange-50/40 shadow-sm'
                            : 'border-zinc-200 hover:border-zinc-300 bg-white'
                        }`}
                      >
                        <div
                          className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                            isSelected
                              ? 'border-orange-500 bg-orange-500 text-white'
                              : 'border-zinc-300'
                          }`}
                        >
                          {isSelected && <FaCheck className="text-[10px]" />}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-black text-sm md:text-base">
                            {addr.rua}, {addr.complemento}
                          </p>
                          <p className="text-xs text-zinc-500 mt-0.5">
                            {addr.cidade} - CEP: {addr.cep}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center bg-zinc-50 rounded-xl border border-dashed border-zinc-300">
                  <p className="text-zinc-600 font-medium mb-4">
                    Você ainda não possui nenhum endereço cadastrado
                  </p>
                  <MainButton
                    title="Adicionar Endereço"
                    classe="primary"
                    type="button"
                    onPress={() => navigate('/address/create')}
                  />
                </div>
              )}
            </section>

            {/* Seção 2: Forma de Pagamento */}
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200/80">
              <h2 className="text-xl font-bold text-black mb-4">Forma de Pagamento</h2>
              <div className="grid grid-cols-2 gap-4">
                
                {/* Opção PIX */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('pix')}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 font-bold transition-all gap-2 ${
                    paymentMethod === 'pix'
                      ? 'border-orange-500 bg-orange-50/50 text-orange-600 shadow-sm'
                      : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                  }`}
                >
                  <FaPix className="text-2xl text-teal-600" />
                  <span className="text-sm">Pix</span>
                </button>

                {/* Opção Cartão de Crédito */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('credit_card')}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 font-bold transition-all gap-2 ${
                    paymentMethod === 'credit_card'
                      ? 'border-orange-500 bg-orange-50/50 text-orange-600 shadow-sm'
                      : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                  }`}
                >
                  <FaCreditCard className="text-2xl text-blue-600" />
                  <span className="text-sm">Cartão de Crédito</span>
                </button>
              </div>
            </section>
          </div>

          {/* Coluna da Direita: Resumo do Pedido */}
          <div className="lg:col-span-1">
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200/80 sticky top-20">
              <h2 className="text-xl font-bold text-black border-b border-zinc-100 pb-3 mb-4">
                Resumo do Pedido
              </h2>

              <ul className="divide-y divide-zinc-100 max-h-60 overflow-y-auto pr-1 mb-4">
                {cart &&
                  cart.map((item) => (
                    <li key={item._id} className="py-3 flex items-center justify-between text-sm">
                      <div className="pr-2">
                        <p className="font-medium text-black line-clamp-1">{item.title}</p>
                        <p className="text-xs text-zinc-400">Qtd: {item.amount}</p>
                      </div>
                      <span className="font-semibold text-black whitespace-nowrap">
                        {(item.price * item.amount).toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        })}
                      </span>
                    </li>
                  ))}
              </ul>

              {/* Totalizador */}
              <div className="border-t border-zinc-100 pt-4 space-y-2">
                <div className="flex justify-between text-zinc-500 text-sm">
                  <span>Subtotal</span>
                  <span>
                    {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
                <div className="flex justify-between text-zinc-500 text-sm">
                  <span>Entrega</span>
                  <span className="text-green-600 font-semibold">Grátis</span>
                </div>
                <div className="flex justify-between text-lg font-black text-black pt-2 border-t border-zinc-100">
                  <span>Total</span>
                  <span className="text-orange-500">
                    {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
              </div>

              {/* Botão Finalizar */}
              <div className="mt-5 flex items-center justify-end">
                <MainButton
                  onPress={handleFinish}
                  type="button"
                  disabled={loadingCr || addresses.length === 0}
                  classe="primary"
                  title={loadingCr ? (
                    'Aguarde'
                  ) : (
                    'Finalizar Pedido'
                  )}
                />
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
