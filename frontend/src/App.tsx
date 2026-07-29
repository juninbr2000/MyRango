import './App.css'

import { Route, Routes } from 'react-router-dom'

import Login from './pages/UserSign/Login'
import Register from './pages/UserSign/Register'
import Home from './pages/Home/Home'
import { useAuth } from './context/authContext'
import Product from './pages/Product/Product'
import AddressView from './pages/address/AddressView'
import CartView from './pages/cart/CartView'
import UserOrder from './pages/order/UserOrder'
import CheckoutPage from './pages/cart/CheckoutPage'
import Dashboard from './pages/Dashboard/Dashboard'
import OrderDetails from './pages/order/OrderDetails'
import PaymentPage from './pages/cart/PaymentPage'
import CreateOrEditAddress from './pages/address/CreateAddress'
import DashboardProducts from './pages/Dashboard/DashboardProducts'
import DashboardFormProduct from './pages/Dashboard/DashboardFormProduct'

function App() {

  const { user } = useAuth()

  // if(loading){
  //   return (
  //     <div className='w-screen h-screen bg-orange-600 flex flex-col gap-8 items-center justify-center'>
  //       <img src='/logo.svg' className='w-1/4' />
  //       <div className="w-10 h-10 border-4 border-t-orange-400 border-gray-300 rounded-full animate-spin"></div>
  //     </div>
  //   )
  // }

  return (
    <Routes >
      <Route path='/' element={<Home />} />
      <Route path='/:id' element={<Product />} />

      <Route path='/address' element={user ? <AddressView /> : <Login />} />
      <Route path='/address/create' element={user ? <CreateOrEditAddress /> : <Login />} />
      <Route path="/address/edit/:id" element={user ? <CreateOrEditAddress /> : <Login />} />

      <Route path='/cart' element={user ? <CartView /> : <Login />} />
      <Route path='/finish' element={user ? <CheckoutPage /> : <Login />} />

      <Route path='/order' element={user ? <UserOrder /> : <Login />} />
      <Route path='/order/:id' element={user ? <OrderDetails /> : <Login />} />
      <Route path='/payment/:id' element={user ? <PaymentPage /> : <Login />} />


      <Route path='/login' element={!user ? <Login /> : <Home/> } />
      <Route path='/register' element={!user ? <Register /> : <Home/> } />

      <Route path='/dashboard' element={!user ? <Login /> : <Dashboard/> } />
      <Route path='/dashboard/products' element={!user ? <Login /> : <DashboardProducts/> } />
      <Route path='/dashboard/create' element={!user ? <Login /> : <DashboardFormProduct/> } />
      <Route path='/dashboard/:id' element={!user ? <Login /> : <DashboardFormProduct/> } />
    </Routes>
  )
}

export default App
