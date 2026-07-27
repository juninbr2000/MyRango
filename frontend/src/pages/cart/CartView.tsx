import { useNavigate } from "react-router-dom"
import { useDocumentStorage } from "../../Hooks/useDocumentStorage" // ajuste o caminho
import type { CartItem } from "../../types/OrderTypes"
import Navbar from "../../components/layout/Navbar"
import MainButton from "../../components/ui/MainButton"
import { FaCartShopping } from "react-icons/fa6"
import { FaArrowLeft, FaMinus, FaPlus, FaTrash } from "react-icons/fa"

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

  if (!docs || docs.length === 0) {
    return (
      <div className="min-h-screen bg-zinc-200 text-black pt-16 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-4 text-center max-w-md mx-auto">
          <div className="w-20 h-20 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mb-4 shadow-inner">
            <FaCartShopping className="text-3xl" />
          </div>
          <h2 className="text-2xl font-extrabold text-black mb-2">Seu carrinho está vazio</h2>
          <p className="text-zinc-500 text-sm mb-6">
            Parece que você ainda não adicionou nenhum item gostoso ao seu pedido.
          </p>
          <MainButton
            title="Ver Cardápio"
            classe="primary"
            type="button"
            onPress={() => navigate('/')}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-200 text-black pt-16 pb-12">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 mt-6">
        {/* Header do Carrinho */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="p-2 bg-white rounded-xl text-zinc-600 hover:text-black hover:bg-zinc-100 transition-colors shadow-sm"
              aria-label="Voltar"
            >
              <FaArrowLeft />
            </button>
            <h1 className="text-2xl md:text-3xl font-extrabold text-black">Seu Carrinho</h1>
          </div>

          <button
            className="flex items-center gap-1.5 text-xs font-bold text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-xl transition-colors"
            onClick={clear}
          >
            <FaTrash className="text-xs" />
            <span>Limpar carrinho</span>
          </button>
        </div>

        {/* Layout Principal: Lista + Resumo */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Lista de Produtos (2 Colunas no Desktop) */}
          <div className="lg:col-span-2 space-y-3">
            {docs.map((item: any) => (
              <div
                key={item._id}
                className="bg-white rounded-2xl p-4 shadow-sm border border-zinc-200/80 flex gap-4 transition-all hover:shadow-md"
              >
                {/* Imagem do Produto */}
                <div className="w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-400 text-xs font-medium">
                      Sem imagem
                    </div>
                  )}
                </div>

                {/* Conteúdo / Infos */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-black text-base md:text-lg leading-tight">
                        {item.title}
                      </h3>
                      <button
                        className="text-zinc-400 hover:text-red-500 p-1 transition-colors"
                        onClick={() => handleRemove(item._id)}
                        aria-label={`Remover ${item.title}`}
                      >
                        <FaTrash className="text-sm" />
                      </button>
                    </div>

                    {item.observation && (
                      <div className="mt-1 bg-amber-50 border border-amber-200/60 rounded-lg p-1.5 text-xs text-amber-800">
                        <span className="font-semibold">Obs:</span> {item.observation}
                      </div>
                    )}
                  </div>

                  {/* Controles de Quantidade + Preço */}
                  <div className="mt-3 flex items-center justify-between">
                    {/* Botões de + e - */}
                    <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-xl border border-zinc-200">
                      <button
                        className="w-7 h-7 bg-white text-zinc-700 rounded-lg flex items-center justify-center hover:bg-zinc-200 active:scale-95 transition-all text-xs font-bold shadow-sm"
                        onClick={() => changeQty(item._id, -1)}
                        aria-label="Diminuir quantidade"
                      >
                        <FaMinus />
                      </button>
                      <span className="min-w-7 text-center font-bold text-sm text-black">
                        {item.amount}
                      </span>
                      <button
                        className="w-7 h-7 bg-white text-orange-600 rounded-lg flex items-center justify-center hover:bg-zinc-200 active:scale-95 transition-all text-xs font-bold shadow-sm"
                        onClick={() => changeQty(item._id, +1)}
                        aria-label="Aumentar quantidade"
                      >
                        <FaPlus />
                      </button>
                    </div>

                    {/* Preços */}
                    <div className="text-right">
                      <p className="text-[11px] text-zinc-400">
                        {formatBRL(item.price)} un.
                      </p>
                      <p className="text-base font-extrabold text-orange-500">
                        {formatBRL(item.price * item.amount)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Card de Resumo e Checkout (Fixo no Desktop) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-zinc-200/80 p-6 sticky top-20">
              <h2 className="text-xl font-bold text-black border-b border-zinc-100 pb-3 mb-4">
                Resumo da Compra
              </h2>

              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between text-zinc-600">
                  <span>Itens ({docs.length})</span>
                  <span>{formatBRL(total)}</span>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span>Taxa de entrega</span>
                  <span className="text-xs font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded">
                    Calculado no checkout
                  </span>
                </div>
                <div className="border-t border-zinc-100 pt-3 flex justify-between items-center text-black">
                  <span className="font-bold text-base">Total</span>
                  <span className="text-2xl font-black text-orange-500">
                    {formatBRL(total)}
                  </span>
                </div>
              </div>

              <MainButton
                title={`Avançar para Checkout`}
                onPress={handleCheckout}
                classe="primary"
                type="button"
              />
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}