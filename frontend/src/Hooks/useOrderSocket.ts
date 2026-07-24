import { useEffect, useRef } from 'react'
import { socket } from '../services/Socket'
import type { Order } from '../types/OrderTypes'

export function useOrderSocket(orderId: string | undefined, onPaymentSuccess: (updatedOrder: Order) => void) {
  const savedCallback = useRef(onPaymentSuccess)

  useEffect(() => {
    savedCallback.current = onPaymentSuccess
  }, [onPaymentSuccess])

  useEffect(() => {
    if (!orderId) return

    const roomName = `order-${orderId}`

    socket.emit('join-room', roomName)

    const handlePayment = (updatedOrder: Order) => {
      if (updatedOrder.paymentStatus === 'paid') {
        savedCallback.current(updatedOrder)
      }
    }

    socket.on('payment', handlePayment)

    return () => {
      socket.emit('leave-room', roomName)
      socket.off('payment', handlePayment)
    }
  }, [orderId])
}