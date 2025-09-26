import { useEffect, useState } from "react"
import Navbar from "../../components/layout/Navbar" 
import type { Address } from "../../types/AddressTypes"
import { useDocumentStorage } from "../../Hooks/useDocumentStorage"
import { useFetchDocuments } from "../../Hooks/usefetchDocuments"
import { useAuth } from "../../context/authContext"
import type { CartItem } from "../../types/OrderTypes"
import { useNavigate } from "react-router-dom"
import { useCreateDocument } from "../../Hooks/useCreateDocument"

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
        navigate('/order')
      }
    } catch (error) {
      console.error(error)
    }
  }

  if(!loading && cart === undefined){
    navigate('/cart')
  }

  return (
    <div className="bg-zinc-100 min-h-screen text-black">
      <Navbar />

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <h1 className="text-2xl font-bold">Finalizar Compra</h1>

        {/* Endereço */}
        <section className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-2">Endereço de Entrega</h2>
          {addresses.map((addr) => (
            <label
              key={addr._id}
              className="flex items-center gap-2 p-2 border rounded-lg mb-2 cursor-pointer hover:bg-zinc-50"
            >
              <input
                type="radio"
                name="address"
                value={addr._id}
                checked={selectedAddress === addr._id}
                onChange={() => setSelectedAddress(addr._id)}
              />
              <span>
                {addr.rua}, {addr.complemento} - {addr.cidade} ({addr.cep})
              </span>
            </label>
          ))}
        </section>

        {/* Pagamento */}
        <section className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-2">Forma de Pagamento</h2>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="payment"
                value="pix"
                checked={paymentMethod === "pix"}
                onChange={() => setPaymentMethod("pix")}
              />
              Pix
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="payment"
                value="credit_card"
                checked={paymentMethod === "credit_card"}
                onChange={() => setPaymentMethod("credit_card")}
              />
              Cartão de Crédito
            </label>
          </div>
        </section>

        {/* Resumo */}
        <section className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-2">Resumo do Pedido</h2>
          <ul className="divide-y">
            {cart && cart.map((item) => (
              <li key={item._id} className="py-2 flex justify-between">
                <span>
                  {item.title} x{item.amount}
                </span>
                <span>R$ {(item.price * item.amount).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between mt-4 font-bold text-lg">
            <span>Total:</span>
            <span>R$ {total.toFixed(2)}</span>
          </div>
          <button
            onClick={handleFinish}
            className="mt-4 w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition"
            disabled={loadingCr}
          >
            {loadingCr ? "Aguarde" : 'Finalizar Pedido'}
          </button>
        </section>
      </div>
    </div>
  )
}
