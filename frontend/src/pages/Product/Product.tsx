import { useParams } from 'react-router-dom'
import { useFetchDocuments } from '../../Hooks/usefetchDocuments'
import Navbar from '../../components/layout/Navbar'
import type { ProductFullData } from '../../types/ProductsTypes'
import { useDocumentStorage } from '../../Hooks/useDocumentStorage'
import { useState } from 'react'

function Product() {
    const { id } = useParams()
    const { document: product, loading, error } = useFetchDocuments<ProductFullData>("product", id)
    const {addItem} = useDocumentStorage('cart')

    const [quantity, setQuantity] = useState(1)
    const [note, setNote] = useState("")

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-zinc-200">
                <p className="text-zinc-600">Carregando produto...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen bg-zinc-200">
                <p className="text-red-600">{error}</p>
            </div>
        )
    }

    if (!product) {
        return (
            <div className="flex items-center justify-center h-screen bg-zinc-200">
                <p className="text-zinc-600">Produto não encontrado.</p>
            </div>
        )
    }

    const handleAddToCart = () => {
    if (!product.available) return
    // Aqui você pode disparar para o contexto do carrinho ou API
    addItem({
      _id: product._id,
      title: product.title,
      price: product.price,
      amount: quantity,
      observation:note ,
      imageUrl: product.imageUrl
    })

  }

    return (
        <div className="bg-zinc-200 min-h-screen w-screen">
            <Navbar />
            <div className="max-w-4xl mx-auto mt-16">
                <div className="bg-white shadow-lg overflow-hidden flex flex-col md:flex-row">

                    {/* Imagem */}
                    <div className="md:w-1/2 flex items-center justify-center bg-zinc-100">
                        {product.imageUrl ? (
                            <img
                                src={product.imageUrl}
                                alt={product.title}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="flex items-center justify-center w-full h-64 text-zinc-400 italic">
                                Sem imagem
                            </div>
                        )}
                    </div>

                    {/* Informações */}
                    <div className="md:w-1/2 p-6 flex flex-col justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-zinc-800">{product.title}</h1>
                            <p className="mt-2 text-zinc-600">{product.description}</p>
                            <p className="mt-4 text-lg font-semibold text-orange-600">
                                R$ {product.price.toFixed(2)}
                            </p>
                            {!product.available && (
                                <p className="mt-2 text-red-500 font-medium">Indisponível no momento</p>
                            )}
                        </div>

                        {/* Quantidade */}
                        <div className="mt-6">
                            <label className="block text-sm font-medium text-zinc-700 mb-1">
                                Quantidade
                            </label>
                            <input
                                type="number"
                                min={1}
                                value={quantity}
                                onChange={(e) => setQuantity(Number(e.target.value))}
                                className="w-20 px-2 py-1 border border-zinc-300 rounded-md text-center text-black"
                            />
                        </div>

                        {/* Observações */}
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-zinc-700 mb-1">
                                Observações
                            </label>
                            <textarea
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder="Ex: Sem cebola, ponto da carne, etc."
                                className="w-full px-3 py-2 border border-zinc-300 rounded-md resize-none text-black"
                                rows={3}
                            />
                        </div>

                        {/* Botão */}
                        <div className="mt-6">
                            <button
                                disabled={!product.available}
                                onClick={handleAddToCart}
                                className={`w-full py-3 rounded-xl font-bold transition ${product.available
                                        ? "bg-orange-600 text-white hover:bg-orange-700"
                                        : "bg-zinc-400 text-zinc-700 cursor-not-allowed"
                                    }`}
                            >
                                {product.available ? `Adicionar ao Carrinho - ${(product.price * quantity).toLocaleString('pt-br', {style: 'currency', currency: 'BRL'})}` : "Indisponível"}
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Product