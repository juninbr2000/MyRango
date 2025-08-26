import React from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa';

interface inputProps {
    title: string,
    icon?: React.ReactNode,
    placeholder: string,
    type: 'text' | 'number' | 'password' | 'phone' | 'address'
    security?: boolean;
    value: string,
    setValue: (value: string) => void;
    autoComplete?: string
}

function InputText({title, icon, placeholder, type, value, setValue, security, autoComplete}: inputProps) {
    const [visible, setVisible] = React.useState(false)

  return (
    <label className='flex flex-col relative'>
        <span className='flex items-center gap-2 text-black font-semibold mb-1.5'>
            {icon}
            <p>{title}</p>
        </span>
        <input 
            type={security && type === 'password' ? (!visible ? 'password' : 'text') : type} 
            placeholder={placeholder} 
            value={value} 
            onChange={(e:React.ChangeEvent<HTMLInputElement>)=> setValue(e.target.value)}
            className='bg-white text-black px-3 py-1.5 rounded border border-zinc-400 focus:border-orange-600
                focus:ring-2 focus:ring-orange-600 focus:ring-offset-2 focus:ring-offset-white
                outline-none transition-all duration-500'
            autoComplete={autoComplete}
        />
        {security && <button className='absolute right-0.5 bottom-0.5 bg-white rounded text-zinc-600 p-2 hover:text-black' type='button' onClick={() => setVisible(!visible)}>{visible ? <FaEyeSlash />: <FaEye /> }</button>}
    </label>
  )
}

export default InputText