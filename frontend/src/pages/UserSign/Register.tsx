import React, { useEffect, type FormEvent} from 'react'
import InputText from '../../components/ui/InputText'
import MainButton from '../../components/ui/MainButton'
import { Link, useNavigate } from 'react-router-dom'
import { FaRegCreditCard, FaRegUser } from 'react-icons/fa'
import { MdOutlineLocalPhone, MdOutlineLock } from 'react-icons/md'
import { useAuthentication } from '../../Hooks/useAuthentication'

function Register() {
    const [name, setName] = React.useState('')
    const [cpf, setcpf] = React.useState('')
    const [phone, setPhone] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [confrimPassword, setConfirmPasword] = React.useState('')
    const [errors, setErrors] = React.useState('')

    const {createUser, loading, error} = useAuthentication()

    const navigate = useNavigate()

    function maskCpfCnpj(value: string) {
        value = value.replace(/\D/g, ""); // só números
  
        if (value.length <= 11) { // CPF
            return value
                .replace(/(\d{3})(\d)/, "$1.$2")
                .replace(/(\d{3})(\d)/, "$1.$2")
                .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
        } else { // CNPJ
             return value
                .replace(/^(\d{2})(\d)/, "$1.$2")
                .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
                .replace(/\.(\d{3})(\d)/, ".$1/$2")
                .replace(/(\d{4})(\d)/, "$1-$2");
        }
    }

    function maskPhone(value: string) {
        value = value.replace(/\D/g, ""); // só números

        if (value.length <= 10) {
         // Telefone fixo (8 dígitos no final)
            return value
                .replace(/(\d{2})(\d)/, "($1) $2")
                .replace(/(\d{4})(\d)/, "$1-$2");
        } else {
         // Celular (9 dígitos no final)
            return value
                .replace(/(\d{2})(\d)/, "($1) $2")
                .replace(/(\d{5})(\d)/, "$1-$2");
        }
    }

    const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if(!name || !cpf || !password || !confrimPassword) return setErrors('Preencha os campos corretamente')
        if(name.length < 3 ) return setErrors('O nome é muito curto')
        if(name.length > 50 ) return setErrors('O nome é muito longo')
        if(confrimPassword !== password) return setErrors('As senhas não coincidem')
        if(cpf.length < 14 || cpf.length > 18 ) return setErrors('O CPF é invalido')
        if(phone && (phone.length < 14 || phone.length > 15)) return setErrors('O formato do telefone é invalido')
        if(password.length < 8) return setErrors('A senha é muito curta')

        const data = {
            name,
            cpf,
            phone,
            password
        }
        console.log(data)

        try{
            const res = await createUser(data)

            console.log(res)
            if(res){
                navigate('/')
            }
        } catch (error: any){
            console.error(error)
            setErrors(error)
        }
    }

    useEffect(() => {
        if(error){
            setErrors(error)
        }
    }, [error])

  return (
    <div className='screen-container w-screen box-border px-5 py-8 flex justify-around items-center flex-col sm:flex-row'>
        <div className='w-full mb-6 sm:w-1/2'>
            <h1 className='text-5xl font-bold text-start sm:text-6xl'>A melhor forma de pedir o seu <span className='text-orange-600'>Lanche Favorito.</span></h1>
            <p className='text-2xl text-white text-start mt-4'>Cadastre-se agora e tenha acesso aos melhores lanches da cidade com entrega rápida.</p>
        </div>

        <form className='bg-white p-4 rounded-2xl w-7/8 box-border sm:w-1/3' onSubmit={handleRegister}>
            <h2 className='text-3xl font-bold text-orange-600 mb-2'>Crie sua Conta!</h2>
            <p className='text-zinc-500'>Preencha todos os campos para se cadastrar</p>

            <div className='flex flex-col gap-4 mt-4'>
                <InputText 
                    title='Nome' 
                    icon={<FaRegUser />} 
                    placeholder='Digite o seu Nome' 
                    type='text' 
                    value={name}
                    setValue={setName}
                />
                <InputText 
                    title='CPF' 
                    icon={<FaRegCreditCard />} 
                    placeholder='Digite o seu CPF ' 
                    type='text' 
                    value={cpf}
                    setValue={(val) => setcpf(maskCpfCnpj(val))}
                />
                <InputText 
                    title='Telefone' 
                    icon={<MdOutlineLocalPhone />} 
                    placeholder='Digite o seu Telefone' 
                    type='phone' 
                    value={phone}
                    setValue={(val) => setPhone(maskPhone(val))}
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
                <InputText 
                    title='Confirme a senha' 
                    icon={<MdOutlineLock />} 
                    placeholder='Digite a sua senha ' 
                    type='password' 
                    value={confrimPassword}
                    setValue={setConfirmPasword}
                    security
                />
                {errors && <p className='text-sm text-red-400 font-semibold'>{errors}</p>}
                <MainButton title={loading ? 'Aguarde...' : 'Criar Conta'} type='submit' classe='primary' disabled={loading} />
            </div>
            <p className='text-zinc-500 mt-3'>Já tem uma conta? <Link to={'/login'} className='text-orange-600 font-semibold'>Faça login</Link></p>
        </form>
    </div>
  )
}

export default Register