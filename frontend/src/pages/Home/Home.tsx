import { useEffect, useState } from 'react'
import Navbar from '../../components/layout/Navbar'
import { useFetchDocuments } from '../../Hooks/usefetchDocuments'
import CardItem from '../../components/layout/CardItem'
import type { ProductFullData } from '../../types/ProductsTypes'
import { useDocumentStorage } from '../../Hooks/useDocumentStorage'
import { MdOutlineShoppingCart } from 'react-icons/md'
import { Link } from 'react-router-dom'

function Home() {
  const [products, setProducts] = useState<ProductFullData[] | null>(null)
  const {docs} = useDocumentStorage('cart')
  
  console.log(docs)

  const {loading, error, document} = useFetchDocuments<ProductFullData[]>('product') 

  useEffect(() => {
    console.log(document)
    setProducts(document)
  }, [document, loading, error])

  return (
    <div className="min-h-screen max-w-screen bg-zinc-200">
      <Navbar />
      <div className="mt-16 px-4 py-8 max-w-7xl mx-auto md:py-16">
        <div className="card w-full rounded-2xl p-8 sm:h-[400px]">
          <h2 className="font-bold text-2xl sm:text-3xl text-start w-4/5">
            Fim de semana com{' '}
            <span className="text-orange-600 italic text-4xl sm:text-5xl">
              entrega gratis
            </span>
            !!
          </h2>
          <p className="text-start italic font-semibold text-zinc-400 mt-8">
            sex - sab - dom
          </p>
        </div>

        <h1 className="mt-6 font-bold text-2xl sm:text-3xl text-start text-black">
          Nosso Cardápio
        </h1>
        <p className='text-md text-left text-zinc-500'>Escolha seu lanche favorito e faça o seu pedido</p>

        {/* Grid responsivo de produtos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-4">
          {products?.map((prod) => (
            <CardItem
              key={prod._id}
              title={prod.title}
              _id={prod._id}
              description={prod.description}
              imageUrl={prod.imageUrl}
              price={prod.price}
            />
          ))}
        </div>
      </div>

      {/* Carrinho flutuante */}
      {docs && docs.length > 0 && (
        <div className="fixed bottom-4 right-4">
          <span className="bg-red-600 px-2.5 py-1 text-sm rounded-full absolute left-[-5px] top-[-12px]">
            {docs.length}
          </span>
          <Link
            to={'/cart'}
            className="bg-orange-600 block rounded-full p-5 text-2xl w-min shadow-lg"
          >
            <MdOutlineShoppingCart />
          </Link>
        </div>
      )}
    </div>
  )
}

export default Home