import { useEffect, useState, type FormEvent } from 'react'
import InputText from '../../components/ui/InputText'
import { FaRegUser } from 'react-icons/fa'
import MainButton from '../../components/ui/MainButton'
import { Link, useNavigate } from 'react-router-dom'
import { MdOutlineLock } from 'react-icons/md'
import { useAuth } from '../../context/authContext'

function Login() {
    const [validator, setValidator] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState('')

    const navigate = useNavigate()
    
    const {login, loading, error}= useAuth()


    const handleLogin = async (e : FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if(!validator || !password) return setErrors('preencha todos os campos')

        try{
            const data = {
                validator,
                password
            }

            const res = await login(data)


            if(res){
                navigate('/')
            }

        } catch (error: any) {
            console.error(error)
            setErrors(error.config?.data?.error)
        }
    }

    useEffect(() => {
        if(error){
            setErrors(error)
        }
    }, [error])

  return (
    <div className='screen-container max-w-screen box-border px-5 py-8 flex justify-around items-center flex-col sm:flex-row'>
        <div className='w-full mb-6 sm:w-1/2'>
            <h1 className='text-5xl font-bold text-start sm:text-6xl'>Peça seu Lanche <span className='text-orange-600'>Favorito</span> na sua casa</h1>
            <p className='text-2xl text-white text-start mt-4'>Delivery rápido e saboroso. Os melhores lanches da cidade, direto na sua porta.</p>
        </div>

        <form className='bg-white p-4 rounded-2xl w-7/8 box-border sm:w-1/3' onSubmit={handleLogin}>
            <h2 className='text-3xl font-bold text-orange-600 mb-2'>Bem-vindo!</h2>
            <p className='text-zinc-500'>Entre com sua conta para continuar</p>

            <div className='flex flex-col gap-4 mt-4'>
                <InputText 
                    title='Nome, CPF ou Telefone' 
                    icon={<FaRegUser />} 
                    placeholder='Digite o seu Nome, seu CPF ou seu Telefone' 
                    type='text' 
                    value={validator}
                    setValue={setValidator}
                />
                <InputText 
                    title='Senha' 
                    icon={<MdOutlineLock />} 
                    placeholder='Digite a sua senha ' 
                    type='password' 
                    value={password}
                    setValue={setPassword}
                    security
                />
                {errors && <p className='text-sm text-red-400 font-semibold'>{errors}</p>}

                <MainButton title={!loading ? 'Entrar' : 'Aguarde...'} type='submit' classe='primary' disabled={loading}/>
            </div>
            <p className='text-zinc-500 mt-3'>Não tem uma conta? <Link to={'/register'} className='text-orange-600 font-semibold'>Cadastre-se</Link></p>
        </form>
    </div>
  )
}

export default Login