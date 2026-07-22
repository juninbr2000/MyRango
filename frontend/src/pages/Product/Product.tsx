import { useNavigate, useParams } from 'react-router-dom'
import { useFetchDocuments } from '../../Hooks/usefetchDocuments'
import Navbar from '../../components/layout/Navbar'
import type { ProductFullData } from '../../types/ProductsTypes'
import { useDocumentStorage } from '../../Hooks/useDocumentStorage'
import { useState } from 'react'
import { LuImageOff } from 'react-icons/lu'
import MainButton from '../../components/ui/MainButton'

function Product() {
    const { id } = useParams()
    const { document: product, loading, error } = useFetchDocuments<ProductFullData>("product", id)
    const {addItem} = useDocumentStorage('cart')

    const [quantity, setQuantity] = useState(1)
    const [note, setNote] = useState("")
    const navigate = useNavigate()

    console.log(product)

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
        addItem({
            _id: product._id,
            title: product.title,
            price: product.price,
            amount: quantity,
            observation:note ,
            imageUrl: product.imageUrl
        })
    
        navigate('/')

    }

    const moreItem = () => {
        setQuantity(quantity + 1)
    }
    const lessItem = () => {
        if(quantity === 1) return
        setQuantity(quantity - 1)
    }

    return (
        <div className="bg-zinc-200 box-border">
            <Navbar />
            <div className='sticky top-12 mt-12 z-0'>
                {product.imageUrl ? 
                    <img src={product.imageUrl} alt={product.title} className='sticky top-12'/> 
                :
                    <div className='bg-zinc-300 min-h-[450px] text-6xl flex items-center justify-center text-orange-500'>
                        <LuImageOff />
                    </div>
                }
            </div>

            <div className='relative z-10 -mt-12 bg-zinc-200 rounded-t-3xl px-8 py-10 box-border'>
                <div className='flex justify-between items-center mb-4'>
                    <h2 className='font-extrabold text-3xl text-black capitalize'>{product.title}</h2>
                    <p className='font-bold text-3xl text-orange-500'>
                        {product.price.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'})} 
                        <span className='text-sm font-medium'>un.</span>
                    </p>
                </div>
                <p className='text-zinc-500 mb-8'>{product.description}</p>

                <div>
                    <h3 className='font-bold text-xl text-orange-500'>Quantidade</h3>
                    <div className='flex items-center justify-center mt-4 gap-10'>
                        <button onClick={lessItem} className='px-5 py-3 bg-gray-100 rounded-full font-bold text-orange-500 text-2xl shadow'>-</button>
                        <p className='text-2xl text-black font-bold'>{quantity}</p>
                        <button onClick={moreItem} className='px-5 py-3 bg-gray-100 rounded-full font-bold text-orange-500 text-2xl shadow'>+</button>
                    </div>
                </div>

                <div className='mt-8 mb-8'>
                    <h3 className='font-bold text-xl text-orange-500'>Observação:</h3>
                    <textarea 
                        name="notes" 
                        value={note} 
                        onChange={(e) => setNote(e.target.value)} 
                        placeholder='Sem cebola, sem tomate ... (opcional)'
                        className='bg-gray-100 border rounded-md w-full mt-4 resize-none text-black border-gray-300 px-3 py-2 shadow'
                    />
                </div>

                <div className='flex justify-between items-center'>
                    <div>
                        <p className='text-gray-500 text-start'>Total:</p>
                        <span className='font-bold text-xl text-orange-500'>{(product.price * quantity).toLocaleString('pt-br', {style: 'currency', currency: "BRL"})}</span>
                    </div>
                    <MainButton classe='primary' title='Adicionar ao Carrinho' type='button' onPress={handleAddToCart} />
                </div>
            </div>
        </div>
    )
}

export default Product