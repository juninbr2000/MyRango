import { FaArrowRight } from 'react-icons/fa'
import type { ProductData } from '../../types/ProductsTypes'
import { Link } from 'react-router-dom'
import { LuImageOff } from 'react-icons/lu'

function CardItem({ title, description = '', price, _id, imageUrl }: ProductData) {
  const longText =
    description.length > 55 ? description.slice(0, 52) + '...' : description

  return (
    <Link
      to={`/${_id}`}
      className="group bg-zinc-50 hover:bg-orange-50/50 border border-zinc-200/80 hover:border-orange-200 rounded-2xl p-3.5 flex gap-3.5 transition-all shadow-xs"
    >
      {/* Imagem do Produto */}
      <div className="w-20 h-20 shrink-0 rounded-xl bg-zinc-200 overflow-hidden border border-zinc-200/60 relative">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-400 text-xl">
            <LuImageOff />
          </div>
        )}
      </div>

      {/* Conteúdo Info */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h4 className="font-bold text-black text-base group-hover:text-orange-600 transition-colors line-clamp-1">
            {title}
          </h4>
          <p className="text-xs text-zinc-500 mt-0.5 line-clamp-2 leading-relaxed">
            {longText}
          </p>
        </div>

        <div className="flex items-center justify-between mt-2">
          <span className="font-black text-orange-500 text-base">
            {price.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}
          </span>

          <span className="w-7 h-7 bg-white group-hover:bg-orange-500 group-hover:text-white text-zinc-400 rounded-lg flex items-center justify-center text-xs transition-all border border-zinc-200 group-hover:border-orange-500 shadow-xs">
            <FaArrowRight />
          </span>
        </div>
      </div>
    </Link>
  )
}

export default CardItem
