import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiMapPin } from 'react-icons/fi'
import { FaTrash, FaPen, FaPlus, FaArrowLeft } from 'react-icons/fa6'
import { useAuth } from '../../context/authContext'
import { useFetchDocuments } from '../../Hooks/usefetchDocuments'
import { useDeleteDocuments } from '../../Hooks/useDeleteDocuments'
import Navbar from '../../components/layout/Navbar'
import MainButton from '../../components/ui/MainButton'

export interface Address {
  _id: string
  rua: string
  numero?: string
  complemento?: string
  bairro: string
  cidade: string
  cep: string
  isDefault?: boolean
}

function AddressView() {
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const { document, loading } = useFetchDocuments<Address[]>('address', '', user?.token)
  const { delectDoc } = useDeleteDocuments('address', user?.token)
  
  const [address, setAddress] = useState<Address[] | null>(null)

  useEffect(() => {
    if (document) {
      setAddress(document)
    }
  }, [document])

  const handleDelete = async (id: string) => {
    try {
      // Atualização otimista da interface
      setAddress((prev) => (prev ? prev.filter((item) => item._id !== id) : null))
      await delectDoc(id)
    } catch (error) {
      console.error('Erro ao deletar endereço:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen w-screen bg-zinc-200 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-t-orange-500 border-zinc-300 rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-200 text-black pt-16 pb-12">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 mt-6">
        {/* Cabeçalho da Página */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 bg-white rounded-xl text-zinc-600 hover:text-black hover:bg-zinc-100 transition-colors shadow-xs"
              aria-label="Voltar"
            >
              <FaArrowLeft />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-black">
                Meus Endereços
              </h1>
              <p className="text-xs text-zinc-500">
                Gerencie seus locais de entrega
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('/address/create')}
            className="hidden sm:flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all active:scale-95"
          >
            <FaPlus />
            <span>Novo Endereço</span>
          </button>
        </div>

        {/* Lista de Endereços */}
        {address && address.length > 0 ? (
          <div className="space-y-3 mb-8">
            {address.map((local) => (
              <div
                key={local._id}
                className="bg-white rounded-2xl p-4 md:p-5 shadow-xs border border-zinc-200/80 flex items-start justify-between gap-4 transition-all hover:shadow-md"
              >
                {/* Ícone e Dados do Endereço */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 shrink-0 rounded-xl bg-orange-50 text-orange-500 border border-orange-100 flex items-center justify-center text-lg mt-0.5">
                    <FiMapPin />
                  </div>

                  <div>
                    <h3 className="font-bold text-black text-base md:text-lg leading-tight">
                      {local.rua}{local.numero ? `, ${local.numero}` : ''}
                    </h3>

                    <p className="text-xs md:text-sm text-zinc-500 mt-1 leading-relaxed">
                      {local.complemento && (
                        <span className="font-medium text-zinc-700">
                          {local.complemento} •{' '}
                        </span>
                      )}
                      Bairro {local.bairro}, {local.cidade}
                    </p>

                    <span className="inline-block mt-2 text-[11px] font-mono font-semibold bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-md">
                      CEP: {local.cep}
                    </span>
                  </div>
                </div>

                {/* Ações (Editar e Excluir) */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => navigate(`/address/edit/${local._id}`)}
                    className="p-2.5 text-zinc-500 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all"
                    title="Editar endereço"
                    aria-label="Editar"
                  >
                    <FaPen className="text-sm" />
                  </button>

                  <button
                    onClick={() => handleDelete(local._id)}
                    className="p-2.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                    title="Excluir endereço"
                    aria-label="Excluir"
                  >
                    <FaTrash className="text-sm" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Estado Vazio */
          <div className="bg-white rounded-3xl p-8 text-center border border-zinc-200/80 shadow-xs mb-8 my-4">
            <div className="w-16 h-16 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
              <FiMapPin />
            </div>
            <h3 className="text-lg font-bold text-black mb-1">
              Nenhum endereço cadastrado
            </h3>
            <p className="text-sm text-zinc-400 mb-6 max-w-sm mx-auto">
              Adicione um endereço para receber seus pedidos com rapidez e praticidade.
            </p>
          </div>
        )}

        {/* Botão Principal Mobile / Rodapé */}
        <div className="sm:hidden">
          <MainButton
            title="Adicionar Novo Endereço"
            onPress={() => navigate('/address/create')}
            classe="primary"
            type="button"
          />
        </div>
      </main>
    </div>
  )
}

export default AddressView