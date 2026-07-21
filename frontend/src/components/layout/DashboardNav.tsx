import React from 'react'
import { Link } from 'react-router-dom'

interface propsnav {
    title: string
}

function DashboardNav({ title }: propsnav) {
  return (
    <nav className='bg-white p-4'>
        <div>
            <h1 className='text-2xl font-bold pt-4 text-black'>Dashboard</h1>
            <h2 className='text-black'>{title}</h2>
        </div>

        <div>
            <ul className='flex items-center justify-center gap-12'>
                <li><Link to='/dashboard' className='font-bold '>Pedidos</Link></li>
                <li><Link to='/dashboard' className=' font-bold '>Produtos</Link></li>
            </ul>
        </div>
    </nav>
  )
}

export default DashboardNav