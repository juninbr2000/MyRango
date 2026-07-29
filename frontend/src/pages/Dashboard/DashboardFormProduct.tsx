import { useEffect, useState, type FormEvent } from "react"
import { FaAlignLeft, FaDollarSign, FaImage, FaListUl, FaSave, FaTag, FaUtensils } from "react-icons/fa"
import { FaXmark } from "react-icons/fa6"
import { useNavigate, useParams } from "react-router-dom"
import { useAuth } from "../../context/authContext"
import { useCreateDocument } from "../../Hooks/useCreateDocument"
import { useFetchDocuments } from "../../Hooks/usefetchDocuments"
import { useUpdateDocument } from "../../Hooks/useUpdateDocuments"

function DashboardFormProduct() {
    const { user } = useAuth()
    const {id} = useParams<{ id?: string }>()
    const isEditing = Boolean(id) 
    const navigate = useNavigate()

    if(!user) return
    
    const { createDoc, loading: loadingCreate } = useCreateDocument('product/create', user?.token)
    const { document: productData, loading: loadingFetch } = useFetchDocuments<any>('product', id, user?.token)
    const { updateDocument, response } = useUpdateDocument('product', user?.token)

    const isLoading = loadingCreate || (isEditing && loadingFetch) || response.loading
    
    const [imageUrl, setImageUrl] = useState<string>('')
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState('')
    const [category, setCategory] = useState('')
    const [errors, setErrors] = useState('')

    useEffect(() => {
        if (isEditing && productData) {
          setImageUrl(productData.imageUrl || '')
          setTitle(productData.title || '')
          setDescription(productData.description || '')
          setPrice(productData.price || '')
          setCategory(productData.category || '')
        }
    }, [isEditing, productData])

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setErrors('')
    
        if (!title || !description || !price ) {
            setErrors('Preencha todos os campos obrigatórios (*).')
            return
        }
    
        const payload = {
            title,
            description,
            price,
            imageUrl,
            category,
            available: true
        }
    
        try {
            if (isEditing && id) {
                await updateDocument(id, payload)
            } else {
                await createDoc(payload)
            }
    
            navigate('/dashboard/products')
        } catch (err: any) {
            const msg =
                err?.response?.data?.error ||
                err?.message ||
                'Erro ao salvar o produto.'
            setErrors(msg)
        }
    }

    if(isLoading){
        return (
            <div className="min-h-screen w-screen bg-zinc-200 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-t-orange-500 border-gray-300 rounded-full animate-spin"></div>
            </div>
        )
    }

  return (
    <div className="min-h-screen bg-zinc-100 text-black pt-24 pb-12 px-4">
      {/* Container Centralizado */}
      <main className="max-w-3xl mx-auto">
        
        {/* Cabeçalho da Página */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white border border-zinc-200 shadow-xs flex items-center justify-center text-orange-500 text-xl">
              <FaUtensils/>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-black tracking-tight">
                {isEditing ? 'Editar Produto' : 'Adicionar Novo Produto'}
              </h1>
              <p className="text-xs text-zinc-500 font-medium">
                {isEditing 
                  ? 'Atualize as informações do item no cardápio.' 
                  : 'Preencha os dados abaixo para cadastrar um novo prato.'}
              </p>
            </div>
          </div>

          {/* Botão Fechar/Voltar Estético */}
          <button className="p-2.5 bg-white rounded-xl text-zinc-400 hover:text-black hover:bg-zinc-100 transition-colors shadow-xs border border-zinc-200/80">
            <FaXmark className="text-lg" />
          </button>
        </div>

        {/* CARD DO FORMULÁRIO */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-zinc-200/80">
          <form className="grid grid-cols-1 md:grid-cols-3 gap-6" onSubmit={handleSubmit}>
            
            {/* COLUNA ESQUERDA: Upload/Preview da Imagem */}
            <div className="md:col-span-1 space-y-4">
              <label className="text-xs font-bold text-zinc-700 uppercase tracking-wide block mb-1">
                Imagem do Produto
              </label>
              
              {/* Área de Preview */}
              <div className="relative group aspect-square rounded-2xl bg-zinc-100 border-2 border-dashed border-zinc-300 flex flex-col items-center justify-center overflow-hidden transition-all hover:border-orange-300 hover:bg-orange-50/50">
                {imageUrl ? (
                  <>
                    <img 
                      src={imageUrl} 
                      alt="Preview do produto" 
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    {/* Overlay de hover */}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <FaImage className="text-white text-3xl" />
                    </div>
                  </>
                ) : (
                  <div className="text-center p-4 flex flex-col items-center gap-3">
                    <FaImage className="text-4xl text-zinc-400" />
                    <p className="text-xs text-zinc-500 font-medium leading-relaxed">
                      Insira a URL da imagem no campo ao lado para visualizar.
                    </p>
                  </div>
                )}
              </div>
              <p className="text-[10px] text-zinc-400 text-center leading-relaxed">
                Use imagens quadradas (1:1) para melhor resultado no app.
              </p>
            </div>

            {/* COLUNA DIREITA: Campos de Texto */}
            <div className="md:col-span-2 space-y-5">
              
              {/* Nome do Produto */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="name" className="text-xs font-bold text-zinc-700 uppercase tracking-wide flex items-center gap-1.5">
                  <FaUtensils className="text-orange-400 text-xs" />
                  Nome do Prato / Lanche <span className="text-orange-500">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Ex: X-Burguer Bacon Artesanal"
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-4 py-3 text-sm text-black placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all shadow-inner"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/* Grid Preço e Categoria */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Preço */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="price" className="text-xs font-bold text-zinc-700 uppercase tracking-wide flex items-center gap-1.5">
                    <FaDollarSign className="text-orange-400 text-xs" />
                    Preço de Venda (R$) <span className="text-orange-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="price"
                      type="number"
                      step="0.01"
                      placeholder="29,90"
                      className="w-full bg-zinc-50 border border-zinc-300 rounded-xl pl-10 pr-4 py-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all shadow-inner font-mono font-medium"
                      required
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-zinc-400">
                      R$
                    </span>
                  </div>
                </div>

                {/* Categoria */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="category" className="text-xs font-bold text-zinc-700 uppercase tracking-wide flex items-center gap-1.5">
                    <FaTag className="text-orange-400 text-xs" />
                    Categoria
                  </label>
                  <div className="relative">
                    <input
                      id="category"
                      type="text"
                      placeholder="Ex: Lanches, Bebidas..."
                      className="w-full bg-zinc-50 border border-zinc-300 rounded-xl pl-10 pr-4 py-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all shadow-inner"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    />
                    <FaListUl className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-zinc-400" />
                  </div>
                </div>
              </div>

              {/* URL da Imagem (Input) */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="image" className="text-xs font-bold text-zinc-700 uppercase tracking-wide flex items-center gap-1.5">
                  <FaImage className="text-orange-400 text-xs" />
                  URL da Imagem
                </label>
                <input
                  id="image"
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)} // Apenas para o preview estético
                  placeholder="https://exemplo.com/imagem-do-lanche.jpg"
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all shadow-inner font-mono text-xs"
                />
              </div>

              {/* Descrição */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="description" className="text-xs font-bold text-zinc-700 uppercase tracking-wide flex items-center gap-1.5">
                  <FaAlignLeft className="text-orange-400 text-xs" />
                  Descrição / Ingredientes
                </label>
                <textarea
                  id="description"
                  rows={4}
                  placeholder="Detalhe os ingredientes, tamanho e o que torna este prato especial..."
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-4 py-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all shadow-inner resize-none leading-relaxed"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

            </div>

            <p className="text-sm font-bold text-red-600">{errors}</p>
            {/* BARRA DE AÇÕES (Botões no rodapé do card) */}
            <div className="col-span-1 md:col-span-3 pt-6 mt-2 border-t border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-end gap-3">
              <button 
                onClick={() => navigate('/dashboard/products')}
                type="button"
                className="px-6 py-3 rounded-xl text-sm font-bold text-zinc-600 hover:bg-zinc-100 transition-colors"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md flex items-center justify-center gap-2.5 active:scale-95"
              >
                <FaSave />
                <span>
                  {isEditing ? 'Salvar Alterações' : 'Cadastrar Produto'}
                </span>
              </button>
            </div>

          </form>
        </div>

        {/* Rodapé sutil estético */}
        <div className="mt-8 text-center">
          <p className="text-[11px] text-zinc-400 font-medium">
            my<span className="text-orange-500">Rango</span> Admin • Gestão de Cardápio Inteligente
          </p>
        </div>

      </main>
    </div>
  )
}

export default DashboardFormProduct