import { useNavigate, useParams } from 'react-router-dom'
import { useFetchDocuments } from '../../Hooks/usefetchDocuments'
import Navbar from '../../components/layout/Navbar'
import type { ProductFullData } from '../../types/ProductsTypes'
import { useDocumentStorage } from '../../Hooks/useDocumentStorage'
import { useState } from 'react'
import { LuImageOff } from 'react-icons/lu'
import MainButton from '../../components/ui/MainButton'
import { FaArrowLeft, FaMinus, FaPlus } from 'react-icons/fa'
import { FaBagShopping } from 'react-icons/fa6'

function Product() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  
  const { document: product, loading, error } = useFetchDocuments<ProductFullData>('product', id)
  const { addItem } = useDocumentStorage('cart')

  const [quantity, setQuantity] = useState(1)
  const [note, setNote] = useState('')

  const handleAddToCart = () => {
    if (!product || product.available === false) return

    addItem({
      _id: product._id,
      title: product.title,
      price: product.price,
      amount: quantity,
      observation: note,
      imageUrl: product.imageUrl,
    })

    navigate('/cart')
  }

  const moreItem = () => setQuantity((prev) => prev + 1)
  const lessItem = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))

  // Estados de Loading, Erro e Não Encontrado
  if (loading) {
    return (
      <div className="min-h-screen w-screen bg-zinc-200 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-t-orange-500 border-gray-300 rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-zinc-200 pt-20 px-4 flex flex-col items-center justify-center text-center">
        <Navbar />
        <h2 className="text-xl font-bold text-zinc-800 mb-2">
          {error || 'Produto não encontrado!'}
        </h2>
        <MainButton
          title="Voltar para a página inicial"
          classe="primary"
          type="button"
          onPress={() => navigate('/')}
        />
      </div>
    )
  }

  return (
    <div className="bg-zinc-200 min-h-screen pb-32 text-black relative">
      <Navbar />

      {/* Banner da Imagem */}
      <div className="relative w-full h-72 md:h-96 bg-zinc-300 overflow-hidden">
        {/* Botão de Voltar Flutuante */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-16 left-4 z-20 w-10 h-10 bg-black/40 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-black/60 transition-all shadow-lg"
          aria-label="Voltar"
        >
          <FaArrowLeft />
        </button>

        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-orange-500 text-6xl">
            <LuImageOff />
          </div>
        )}
      </div>

      {/* Card Principal Sobreposto */}
      <main className="max-w-3xl mx-auto px-4">
        <div className="relative z-10 -mt-10 bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-zinc-200/80">
          
          {/* Título e Preço */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-zinc-100 pb-6 mb-6">
            <div>
              <h1 className="font-extrabold text-2xl md:text-3xl text-black capitalize">
                {product.title}
              </h1>
              {product.available === false && (
                <span className="inline-block mt-1 text-xs font-bold text-red-500 bg-red-50 px-2.5 py-0.5 rounded-full">
                  Esgotado
                </span>
              )}
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-2xl md:text-3xl font-black text-orange-500">
                {product.price.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}
              </span>
              <span className="text-xs font-semibold text-zinc-400">/un.</span>
            </div>
          </div>

          {/* Descrição */}
          {product.description && (
            <div className="mb-8">
              <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400 mb-2">
                Descrição
              </h2>
              <p className="text-zinc-600 leading-relaxed text-sm md:text-base">
                {product.description}
              </p>
            </div>
          )}

          {/* Seletor de Quantidade */}
          <div className="mb-8 bg-zinc-50 p-4 rounded-2xl border border-zinc-200/80 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-black text-base">Quantidade</h3>
              <p className="text-xs text-zinc-400">Quantas unidades você deseja?</p>
            </div>

            <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-xl border border-zinc-200 shadow-sm">
              <button
                onClick={lessItem}
                disabled={quantity <= 1}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-600 hover:bg-zinc-100 disabled:opacity-30 active:scale-95 transition-all text-xs font-bold"
              >
                <FaMinus />
              </button>
              
              <span className="min-w-6 text-center font-extrabold text-lg text-black">
                {quantity}
              </span>

              <button
                onClick={moreItem}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-orange-600 hover:bg-orange-50 active:scale-95 transition-all text-xs font-bold"
              >
                <FaPlus />
              </button>
            </div>
          </div>

          {/* Campo de Observação */}
          <div>
            <h3 className="font-bold text-black text-base mb-1">Alguma observação?</h3>
            <p className="text-xs text-zinc-400 mb-3">
              Retirar algum ingrediente? Alergias? Conta pra gente.
            </p>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ex: Sem cebola, molho à parte..."
              rows={3}
              className="w-full p-3.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-black placeholder:text-zinc-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all resize-none"
            />
          </div>
        </div>
      </main>

      {/* Barra Inferior Fixa para Checkout / Add to Cart */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-zinc-200 p-4 z-30 shadow-lg">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <div>
            <span className="text-xs font-medium text-zinc-400 block">Total do item</span>
            <span className="text-2xl font-extrabold text-orange-500">
              {(product.price * quantity).toLocaleString('pt-br', {
                style: 'currency',
                currency: 'BRL',
              })}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.available === false}
            className="flex-1 max-w-xs bg-orange-500 hover:bg-orange-600 disabled:bg-zinc-300 text-white font-bold py-3.5 px-6 rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 active:scale-95"
          >
            <FaBagShopping />
            <span>Adicionar ao Carrinho</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Product