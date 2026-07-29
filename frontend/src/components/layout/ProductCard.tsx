import { FaEye, FaEyeSlash, FaTrash } from "react-icons/fa"
import { FaPenToSquare } from "react-icons/fa6"
import type { ProductFullData } from "../../types/ProductsTypes"

interface ProductCardProps {
  product: ProductFullData
  onEdit: (product: ProductFullData) => void
  onDelete: (id: string) => void
  onToggleAvailability?: (id: string, currentStatus: boolean) => void
}

export function ProductCard({
  product,
  onEdit,
  onDelete,
  onToggleAvailability,
}: ProductCardProps) {
  const isAvailable = product.available ?? true

  return (
    <div
      className={`bg-white rounded-2xl p-4 border transition-all flex flex-col justify-between shadow-xs ${
        isAvailable
          ? 'border-zinc-200 hover:border-zinc-300'
          : 'border-zinc-200 bg-zinc-50/60 opacity-80'
      }`}
    >
      <div>
        {/* Imagem do Produto e Badge Status */}
        <div className="relative w-full h-36 bg-zinc-100 rounded-xl overflow-hidden mb-3">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.title}
              className={`w-full h-full object-cover ${
                !isAvailable ? 'grayscale opacity-70' : ''
              }`}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-400 text-xs font-bold">
              Sem Imagem
            </div>
          )}

          {/* Badge de Disponibilidade */}
          <span
            className={`absolute top-2 right-2 text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider ${
              isAvailable
                ? 'bg-emerald-500 text-white'
                : 'bg-zinc-800 text-zinc-200'
            }`}
          >
            {isAvailable ? 'Ativo' : 'Pausado'}
          </span>
        </div>

        {/* Título e Preço */}
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-extrabold text-sm text-black line-clamp-1">
            {product.title}
          </h3>
          <span className="font-black text-orange-500 text-sm shrink-0">
            {product.price.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })}
          </span>
        </div>

        {/* Descrição */}
        {product.description && (
          <p className="text-xs text-zinc-500 line-clamp-2 mb-4 font-normal">
            {product.description}
          </p>
        )}
      </div>

      {/* Ações / Botões */}
      <div className="pt-3 border-t border-zinc-100 flex items-center justify-between gap-2 mt-2">
        {/* Botão Pausar / Ativar */}
        <button
          type="button"
          onClick={() =>
            onToggleAvailability &&
            onToggleAvailability(product._id, isAvailable)
          }
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
            isAvailable
              ? 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
          }`}
          title={isAvailable ? 'Pausar venda no app' : 'Ativar produto'}
        >
          {isAvailable ? <FaEyeSlash /> : <FaEye />}
          <span>{isAvailable ? 'Pausar' : 'Ativar'}</span>
        </button>

        <div className="flex items-center gap-1">
          {/* Editar */}
          <button
            type="button"
            onClick={() => onEdit(product)}
            className="p-2 text-zinc-500 hover:text-black hover:bg-zinc-100 rounded-lg transition-colors"
            title="Editar produto"
          >
            <FaPenToSquare className="text-sm" />
          </button>

          {/* Excluir */}
          <button
            type="button"
            onClick={() => onDelete(product._id)}
            className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
            title="Excluir produto"
          >
            <FaTrash className="text-sm" />
          </button>
        </div>
      </div>
    </div>
  )
}