import { useEffect, useState } from 'react'
import Navbar from '../../components/layout/Navbar'
import { useFetchDocuments } from '../../Hooks/usefetchDocuments'
import CardItem from '../../components/layout/CardItem'
import type { ProductFullData } from '../../types/ProductsTypes'
import { useDocumentStorage } from '../../Hooks/useDocumentStorage'
import { MdDeliveryDining, MdOutlineShoppingCart } from 'react-icons/md'
import { Link } from 'react-router-dom'
import { FaClock } from 'react-icons/fa'

function Home() {
  const [products, setProducts] = useState<ProductFullData[] | null>(null)
  const {docs} = useDocumentStorage('cart')


  const {loading, error, document} = useFetchDocuments<ProductFullData[]>('product') 

  useEffect(() => {
    setProducts(document)
  }, [document, loading, error])

  return (
    <div className="min-h-screen max-w-screen bg-zinc-200">
      <Navbar />
      <div className="sticky top-10 card flex flex-col items-center justify-around h-[360px] px-6 py-4 mt-10 z-0 md:h-[600px]">
        <h2 className='font-bold text-3xl text-start'>
          Fim de semana com {' '}
          <span className='text-orange-500'>
            Entrega Grátis!
          </span>
        </h2>
        <div className='flex justify-between w-full text-orange-500 md:justify-center md:gap-5'>
          <span className='flex gap-1.5 items-center'>
            <FaClock />
            <p className='text-white font-medium'>20 ~ 40 min</p>
          </span>
          <span className='flex gap-1.5 items-center'>
            <MdDeliveryDining />
            <p className='text-white font-medium'>Entrega Grátis</p>
          </span>
        </div>
      </div>

      <div className='relative z-10 -mt-12 bg-zinc-200 rounded-t-3xl px-4 py-10'>
        <h2 className='text-start font-bold text-3xl text-black pl-4'>Nosso Cardápio</h2>
        <p className='text-start text-zinc-600 pl-4'>Escolha seu lanche favorito e faça o seu pedido</p>

        <div className='bg-[#EEEEEE] mt-5 rounded-xl pb-4'>
          <div className='p-4'>
            <h3 className='text-2xl text-orange-500 font-bold text-start'>Lanches</h3>
            <p className='text-start text-zinc-600 text-sm'>Os mais Diversos sabores</p>
          </div>

          {products && products.map((pr) => (
            <CardItem description={pr.description} title={pr.title} _id={pr._id} price={pr.price} />
          ))}
        </div>
      </div>

      <Link to={'/cart'} aria-label='carrinho' className='fixed z-40 right-6 bottom-10 bg-orange-500 px-5 py-5 rounded-full text-xl shadow'>
        <MdOutlineShoppingCart/>
        {docs && docs.length > 0 && <span className='absolute text-xs left-0 top-0 bg-red-500 px-2 py-0.5 rounded-full'>
          {docs.length > 0 && docs.length}
        </span>}
      </Link>
    </div>
  )
}

export default Home