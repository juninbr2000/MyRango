import { useEffect, useState } from 'react'
import Navbar from '../../components/layout/Navbar'
import { useFetchDocuments } from '../../Hooks/usefetchDocuments'
import { useAuth } from '../../context/authContext'
import { FiMapPin } from 'react-icons/fi'
import MainButton from '../../components/ui/MainButton'
import { FaRegTrashAlt } from 'react-icons/fa'
import { MdOutlineEdit } from 'react-icons/md'
import type { Address } from '../../types/AddressTypes'
import { useNavigate } from 'react-router-dom'
import { useDeleteDocuments } from '../../Hooks/useDeleteDocuments'

function AddressView() {
    const {user} = useAuth()
    const {document, loading} = useFetchDocuments<Address[]>('address', '', user?.token)
    const {delectDoc} = useDeleteDocuments('address', user?.token)
    const [address, setAddress] = useState<Address[] | null>(null)
    const navigate = useNavigate()

    useEffect(() => {
        if(document){
            setAddress(document)
        }
    }, [document])

    const handleDelete = async (id: string) => {
        try {
            await delectDoc(id)

            setAddress((prevAddresses) => prevAddresses ? prevAddresses.filter((address: Address) => address._id !== id) : null);
        } catch (error) {
            console.error(error)
        }
    }

    if(loading){
        return (
            <div className='min-h-screen w-screen bg-zinc-200 flex items-center justify-center'>
                <div className="w-10 h-10 border-4 border-t-orange-400 border-gray-300 rounded-full animate-spin"></div>
            </div>
        )
    }

    console.log(document)
  return (
    <div className='bg-zinc-200 w-screen h-screen pt-16'>
        <Navbar />
        <div className='px-4 py-8 flex flex-col gap-8'> 
            {address && address.length > 0 ? address.map((local: Address) => (
                <div className='flex bg-white text-black rounded-md p-4 items-center justify-center gap-2' key={local._id}>
                    <p className='text-orange-600 text-3xl'><FiMapPin /></p>
                    <div>
                        <p className='font-semibold text-zinc-600 text-start ml-4'>{local.rua.toUpperCase()}.</p>
                        <p className='text-sm font-light text-zinc-500 text-start ml-4'>{local.complemento.toUpperCase()} | bairro: {local.bairro.toUpperCase()}, {local.cidade.toUpperCase()}. {local.cep}</p>
                    </div>
                    <div className='flex flex-col justify-between items-center gap-2'>
                        <button className='px-3 py-4 bg-orange-400 rounded text-white'><MdOutlineEdit /></button>
                        <button className='px-3 py-4 bg-red-600 rounded text-white' onClick={() => handleDelete(local._id)}><FaRegTrashAlt /></button>
                    </div>
                </div>
            )) : (
                <p>Voce ainda nao adicionou nenhum endereço</p>
            )}
            {!address && (
                <p>Voce ainda nao adicionou nenhum endereço</p>
            )}
            <MainButton title='Adicionar Endereço' onPress={()=> {navigate('/address/create')}} classe='primary' type='button' />
        </div>
    </div>
  )
}

export default AddressView