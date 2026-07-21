import { FaArrowRight } from 'react-icons/fa'
import type { ProductData } from '../../types/ProductsTypes'
import { Link } from 'react-router-dom'

function CardItem({ title, description, price, _id }: ProductData) {

  const longText = description.length > 60 ? description.slice(0, 57) + '...' : description
  return (
    <Link
      to={`/${_id}`}
      className="flex gap-2 rounded hover:bg-orange-50 transition-all py-2 px-4"
    >
      <div className='w-[75%]'>
        <h4 className='text-start font-bold text-black text-lg'>{title}</h4>
        <p className='text-start font-light text-zinc-400 text-sm'>{longText}</p>
      </div>
      <div className='w-[25%] flex flex-col'>
        <p className='text-orange-500 font-bold'>{price.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'})}</p>

        <span className='text-zinc-400 mt-4 flex flex-col items-end'><FaArrowRight /></span>
      </div>
    </Link>
  )
}

export default CardItem
