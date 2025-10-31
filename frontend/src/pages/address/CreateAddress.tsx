import { useEffect, useState, type FormEvent } from 'react'
import Navbar from '../../components/layout/Navbar'
import InputText from '../../components/ui/InputText'
import MainButton from '../../components/ui/MainButton'
import { useAuth } from '../../context/authContext'
import { useCreateDocument } from '../../Hooks/useCreateDocument'
import { useNavigate } from 'react-router-dom'

function CreateAddress() {
    const {user} = useAuth()

    if(!user){
        return
    }
    const {createDoc, loading, error} = useCreateDocument('address/create', user?.token)
    const navigate = useNavigate()

    const [cep, setCep] = useState('')
    const [city, setCity] = useState('')
    const [bairro, setBairro] = useState('')
    const [number, setNumber] = useState('')
    const [rua, setRua] = useState('')
    const [referencia, setReferencia] = useState('')
    const [errors, setErrors] = useState<string>('')

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if(!cep || !city || !bairro || !rua || !number) {
            setErrors('Preencha todos os campos')
            return
        }

        try {
            const data = {
                cep,
                cidade: city,
                bairro,
                complemento: number,
                referencia,
                rua
            }

            const res = await createDoc(data)
            console.log(res)

            if(res){
                navigate('/address')
            }
            
        } catch (error: any) {
            const msg =
                error?.response?.data?.error ||
                error?.message ||
                "Erro ao criar o endereço"
            setErrors(msg)
            console.error(error)
        }
    }


    const cepFormat = (value: string) => {
        return value.replace(/\D/g, "") // remove não dígitos
                    .replace(/^(\d{5})(\d{3})$/, "$1-$2")
    }

    useEffect(() => {
        if(error){
            setErrors(error)
            console.log(error)
        }
    }, [error ,loading])

  return (
    <div className='bg-zinc-200 w-screen min-h-screen pt-16'>
        <Navbar />
        <div className='flex flex-col px-4 py-6'>
            <h1 className='text-start text-black font-semibold text-2xl mb-4'>Adicionar endereço</h1>
            <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                <InputText title='CEP' placeholder='Digite o CEP do seu endereço' type='text' value={cep} setValue={(val) => setCep(cepFormat(val))} />
                <InputText title='Cidade' placeholder='Digite sua cidade' type='text' value={city} setValue={setCity} />
                <InputText title='Bairro' placeholder='Digite seu bairro' type='text' value={bairro} setValue={setBairro} autoComplete='address-level3' />
                <InputText title='Rua' placeholder='Digite sua Rua' type='text' value={rua} setValue={setRua} autoComplete='address-line1' />
                <InputText title='Numero' placeholder='EX: Apt.2, 3º andar...' type='text' value={number} setValue={setNumber} autoComplete='address-line2' />
                <InputText title='Referencia' placeholder='Digite algo para ajudar a achar sua casa' type='text' value={referencia} setValue={setReferencia} />
                <p className='font-semibold text-sm text-red-500'>{errors}</p>
                <MainButton title={loading ? 'Aguarde...' :'Criar'} type='submit' classe='primary' disabled={loading}/>
            </form>
        </div>
    </div>
  )
}

export default CreateAddress