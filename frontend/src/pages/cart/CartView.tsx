import { useNavigate } from "react-router-dom"
import { useDocumentStorage } from "../../Hooks/useDocumentStorage" // ajuste o caminho
import type { CartItem } from "../../types/OrderTypes"
import Navbar from "../../components/layout/Navbar"
import MainButton from "../../components/ui/MainButton"

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

export default function CartView() {
  const { docs, removeItem, clear, getItem } = useDocumentStorage("cart")
  const navigate = useNavigate()

  const total = docs.reduce((sum, item) => sum + item.price * item.amount, 0)

  // Atualiza quantidade (+/-) direto no localStorage e ressincroniza
  const changeQty = (id: string, delta: number) => {
    const current = JSON.parse(localStorage.getItem("cart") || "[]") as CartItem[]
    const updated = current
      .map((it) =>
        it._id === id ? { ...it, amount: Math.max(1, it.amount + delta) } : it
      )
      .filter((it) => it.amount > 0) // se quiser permitir chegar a 0 e remover
    localStorage.setItem("cart", JSON.stringify(updated))
    getItem()
  }

  const handleRemove = (id: string) => {
    removeItem(id)
  }

  const handleCheckout = () => {
    // ex: navegar para /checkout, abrir modal de pagamento, etc.
    navigate('/finish')
  }

  if (!docs.length) {
    return (
      <div className="min-h-screen w-screen bg-zinc-100 p-4 pt-20">
        <Navbar />
        <h1 className="text-2xl font-bold text-zinc-900 mb-4">Seu carrinho</h1>
        <div className="bg-white rounded-2xl p-6 shadow flex flex-col items-center justify-center">
          <p className="text-zinc-500">Seu carrinho está vazio</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-screen bg-zinc-100 p-4 pt-20">
    <Navbar />
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-2xl font-bold text-zinc-900">Seu carrinho</h1>
        <button
          className="text-sm text-zinc-500 underline underline-offset-4"
          onClick={clear}
        >
          Limpar carrinho
        </button>
      </div>

      <ul className="space-y-3">
        {docs.map((item) => (
          <li
            key={item._id}
            className="bg-white rounded-2xl shadow p-3 flex gap-3"
          >
            {/* Imagem */}
            <div className="w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-zinc-200">
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-400 text-sm">
                  sem imagem
                </div>
              )}
            </div>

            {/* Conteúdo */}
            <div className="flex-1 flex flex-col">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-zinc-900 leading-tight">
                  {item.title}
                </h3>
                <button
                  className="text-xs text-zinc-500 hover:text-red-500"
                  onClick={() => handleRemove(item._id)}
                  aria-label={`Remover ${item.title}`}
                >
                  Remover
                </button>
              </div>

              {item.observation ? (
                <p className="text-xs text-zinc-500 mt-0.5 line-clamp-2">
                  Obs: {item.observation}
                </p>
              ) : null}

              {/* Controles + Subtotal */}
              <div className="mt-3 flex items-center justify-between">
                {/* Quantidade */}
                <div className="flex items-center gap-2">
                  <button
                    className="w-8 h-8 text-orange-600 rounded-lg border border-zinc-300 flex items-center justify-center active:scale-95"
                    onClick={() => changeQty(item._id, -1)}
                    aria-label="Diminuir quantidade"
                  >
                    –
                  </button>
                  <span className="min-w-8 text-center font-medium text-black">
                    {item.amount}
                  </span>
                  <button
                    className="w-8 h-8 text-orange-600 rounded-lg border border-zinc-300 flex items-center justify-center active:scale-95"
                    onClick={() => changeQty(item._id, +1)}
                    aria-label="Aumentar quantidade"
                  >
                    +
                  </button>
                </div>

                {/* Preços */}
                <div className="text-right">
                  <p className="text-xs text-zinc-500">
                    Unitário: {formatBRL(item.price)}
                  </p>
                  <p className="text-sm font-semibold text-orange-600">
                    {formatBRL(item.price * item.amount)}
                  </p>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Resumo */}
      <div className="mt-6 bg-white rounded-2xl shadow p-4 mb-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-zinc-600">Total</span>
          <span className="text-xl font-bold text-zinc-900">
            {formatBRL(total)}
          </span>
        </div>

        <MainButton
          title={`Finalizar pedido — ${formatBRL(total)}`}
          onPress={handleCheckout}
          classe="primary"
          type="button"
        >
        </MainButton>
      </div>
    </div>
  )
}
