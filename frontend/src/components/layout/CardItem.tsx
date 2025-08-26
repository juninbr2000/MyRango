import type { ProductData } from '../../types/ProductsTypes'
import { MdHideImage } from 'react-icons/md'
import { Link } from 'react-router-dom'

function CardItem({ title, description, price, imageUrl, _id }: ProductData) {
  return (
    <Link
      to={`/${_id}`}
      className="flex flex-col sm:flex-row bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer"
    >
      {/* Imagem */}
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={title}
          className="w-full sm:w-32 h-48 sm:h-32 object-cover"
        />
      ) : (
        <div className="w-full sm:w-32 h-48 sm:h-32 bg-zinc-300 flex items-center justify-center text-zinc-600">
          <MdHideImage size={32} />
        </div>
      )}

      {/* Conteúdo */}
      <div className="flex flex-col flex-1 px-4 py-3 justify-between">
        <div>
          <h2 className="font-semibold text-lg text-zinc-800 line-clamp-2 sm:line-clamp-1">
            {title}
          </h2>
          <p className="font-light text-sm text-zinc-500 line-clamp-3 sm:line-clamp-2">
            {description}
          </p>
        </div>
        <div className="mt-2">
          <span className="font-bold text-lg text-orange-600">
            {price.toLocaleString('pt-br', {
              style: 'currency',
              currency: 'BRL',
            })}
          </span>
        </div>
      </div>
    </Link>
  )
}

export default CardItem
