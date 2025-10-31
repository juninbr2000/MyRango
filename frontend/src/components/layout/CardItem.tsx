import type { ProductData } from '../../types/ProductsTypes'
import { MdHideImage } from 'react-icons/md'
import { Link } from 'react-router-dom'

function CardItem({ title, description, price, imageUrl, _id }: ProductData) {
  return (
    <Link
      to={`/${_id}`}
      className="border border-zinc-300 rounded-md bg-white hover:border-orange-500 hover:shadow-xl transition-all"
    >
      {imageUrl ? (
        <img src={imageUrl} alt={title} className='h-52 w-full object-cover rounded-t-sm' />
      ) : (
        <div className='bg-red-100 flex items-center justify-center h-52 rounded-t-sm text-orange-500'>
          <MdHideImage size={32} />
        </div>
      )}
      <div className='p-7'>
        <h2 className='text-black text-left text-xl font-bold mb-2'>
          {title}
        </h2>
        <p className='text-zinc-400 text-left text-sm mb-4'>
          {description}
        </p>
        <div className='flex flex-row items-center justify-between'>
          <p className='text-orange-500 font-bold text-2xl'>
            {price.toLocaleString('pt-br', {style: 'currency', currency: "BRL"})}
          </p>
          <button className='bg-orange-500 text-md font-semibold px-4 py-2 rounded'>
            Adicionar
          </button>
        </div>
      </div>
    </Link>
  )
}

export default CardItem
