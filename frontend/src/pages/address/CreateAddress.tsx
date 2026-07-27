import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FaArrowLeft, FaMagnifyingGlass } from 'react-icons/fa6'
import Navbar from '../../components/layout/Navbar'
import MainButton from '../../components/ui/MainButton'
import { useAuth } from '../../context/authContext'
import { useCreateDocument } from '../../Hooks/useCreateDocument'
import { useFetchDocuments } from '../../Hooks/usefetchDocuments'
import { useUpdateDocument } from '../../Hooks/useUpdateDocuments'

function CreateOrEditAddress() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { id } = useParams<{ id?: string }>() // Se 'id' existir, estamos no modo EDIÇÃO
  const isEditing = Boolean(id)

  if (!user) {
    return null
  }

  // Hooks de API (Criar, Buscar e Atualizar)
  const { createDoc, loading: loadingCreate } = useCreateDocument('address/create', user?.token)
  const { document: addressData, loading: loadingFetch } = useFetchDocuments<any>('address', id, user?.token)
  const { updateDocument, response } = useUpdateDocument('address', user?.token)

  // Form States
  const [cep, setCep] = useState('')
  const [city, setCity] = useState('')
  const [bairro, setBairro] = useState('')
  const [number, setNumber] = useState('')
  const [rua, setRua] = useState('')
  const [referencia, setReferencia] = useState('')
  const [searchingCep, setSearchingCep] = useState(false)
  const [errors, setErrors] = useState<string>('')

  useEffect(() => {
    if (isEditing && addressData) {
      setCep(addressData.cep || '')
      setCity(addressData.cidade || '')
      setBairro(addressData.bairro || '')
      setNumber(addressData.complemento || '')
      setRua(addressData.rua || '')
      setReferencia(addressData.referencia || '')
    }
  }, [isEditing, addressData])

  const handleCepChange = (value: string) => {
    const rawValue = value.replace(/\D/g, '').slice(0, 8)
    const formattedCep = rawValue.replace(/^(\d{5})(\d{3})$/, '$1-$2')
    setCep(formattedCep)

    if (rawValue.length === 8) {
      fetchAddressByCep(rawValue)
    }
  }

  // Busca automática no ViaCEP
  const fetchAddressByCep = async (cleanCep: string) => {
    setSearchingCep(true)
    setErrors('')
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)
      const data = await response.json()

      if (data.erro) {
        setErrors('CEP não encontrado. Por favor, preencha o endereço manualmente.')
        return
      }

      setRua(data.logradouro || '')
      setBairro(data.bairro || '')
      setCity(data.localidade || '')
    } catch (err) {
      console.error('Erro ao buscar CEP:', err)
    } finally {
      setSearchingCep(false)
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrors('')

    if (!cep || !city || !bairro || !rua || !number) {
      setErrors('Preencha todos os campos obrigatórios (*).')
      return
    }

    const payload = {
      cep,
      cidade: city,
      bairro,
      complemento: number,
      referencia,
      rua,
    }

    try {
      if (isEditing && id) {
        // Atualiza o endereço existente
        await updateDocument(id, payload)
      } else {
        // Cria um novo endereço
        await createDoc(payload)
      }

      navigate('/address')
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ||
        err?.message ||
        'Erro ao salvar o endereço.'
      setErrors(msg)
    }
  }

  const isLoading = loadingCreate || response.loading || (isEditing && loadingFetch)

  return (
    <div className="min-h-screen bg-zinc-200 text-black pt-16 pb-12">
      <Navbar />

      <main className="max-w-xl mx-auto px-4 mt-6">
        {/* Header com título dinâmico */}
        <div className="flex items-center gap-3 mb-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="p-2.5 bg-white rounded-xl text-zinc-600 hover:text-black hover:bg-zinc-100 transition-colors shadow-xs"
            aria-label="Voltar"
          >
            <FaArrowLeft />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-black">
              {isEditing ? 'Editar Endereço' : 'Novo Endereço'}
            </h1>
            <p className="text-xs text-zinc-500">
              {isEditing ? 'Atualize os dados de entrega' : 'Cadastre onde quer receber seus pedidos'}
            </p>
          </div>
        </div>

        {/* Card do Formulário */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-zinc-200/80 shadow-xs">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {/* CEP */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="cep" className="text-xs font-bold text-zinc-700 uppercase tracking-wide">
                CEP <span className="text-orange-500">*</span>
              </label>
              <div className="relative flex items-center">
                <input
                  id="cep"
                  type="text"
                  placeholder="00000-000"
                  value={cep}
                  onChange={(e) => handleCepChange(e.target.value)}
                  maxLength={9}
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-4 py-3 text-sm text-black placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all font-mono font-medium"
                  required
                />
                <div className="absolute right-3 text-zinc-400">
                  {searchingCep ? (
                    <span className="text-xs text-orange-500 font-bold animate-pulse">
                      Buscando...
                    </span>
                  ) : (
                    <FaMagnifyingGlass className="text-sm" />
                  )}
                </div>
              </div>
            </div>

            {/* Rua */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="rua" className="text-xs font-bold text-zinc-700 uppercase tracking-wide">
                Rua / Avenida <span className="text-orange-500">*</span>
              </label>
              <input
                id="rua"
                type="text"
                placeholder="Ex: Av. Paulista"
                value={rua}
                onChange={(e) => setRua(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-4 py-3 text-sm text-black placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
                required
              />
            </div>

            {/* Grid Número/Complemento e Bairro */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="number" className="text-xs font-bold text-zinc-700 uppercase tracking-wide">
                  Número / Apto <span className="text-orange-500">*</span>
                </label>
                <input
                  id="number"
                  type="text"
                  placeholder="Ex: 123, Apt 4B"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-4 py-3 text-sm text-black placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="bairro" className="text-xs font-bold text-zinc-700 uppercase tracking-wide">
                  Bairro <span className="text-orange-500">*</span>
                </label>
                <input
                  id="bairro"
                  type="text"
                  placeholder="Ex: Centro"
                  value={bairro}
                  onChange={(e) => setBairro(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-4 py-3 text-sm text-black placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
                  required
                />
              </div>
            </div>

            {/* Cidade */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="city" className="text-xs font-bold text-zinc-700 uppercase tracking-wide">
                Cidade <span className="text-orange-500">*</span>
              </label>
              <input
                id="city"
                type="text"
                placeholder="Ex: São Paulo"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-4 py-3 text-sm text-black placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
                required
              />
            </div>

            {/* Ponto de Referência */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="referencia" className="text-xs font-bold text-zinc-700 uppercase tracking-wide">
                Ponto de Referência <span className="text-zinc-400 font-normal">(Opcional)</span>
              </label>
              <input
                id="referencia"
                type="text"
                placeholder="Ex: Próximo à padaria central"
                value={referencia}
                onChange={(e) => setReferencia(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-4 py-3 text-sm text-black placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
              />
            </div>

            {/* Erros */}
            {errors && (
              <p className="bg-red-50 border border-red-200 text-red-600 font-medium text-xs p-3 rounded-xl">
                {errors}
              </p>
            )}

            {/* Botão de Ação */}
            <div className="mt-2">
              <MainButton
                title={
                  isLoading
                    ? 'Salvando...'
                    : isEditing
                    ? 'Atualizar Endereço'
                    : 'Salvar Endereço'
                }
                type="submit"
                classe="primary"
                disabled={isLoading}
              />
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

export default CreateOrEditAddress