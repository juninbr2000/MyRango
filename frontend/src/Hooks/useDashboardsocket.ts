import { useEffect, useRef } from 'react'
import { socket } from '../services/Socket'
import type { Order } from '../types/OrderTypes'

interface UseDashboardSocketProps {
  onNewOrder?: (newOrder: Order) => void
  onOrderUpdated?: (updatedOrder: Order) => void
}

export function useDashboardSocket({ onNewOrder, onOrderUpdated }: UseDashboardSocketProps) {
  const newOrderCb = useRef(onNewOrder)
  const orderUpdatedCb = useRef(onOrderUpdated)

  useEffect(() => {
    newOrderCb.current = onNewOrder
    orderUpdatedCb.current = onOrderUpdated
  }, [onNewOrder, onOrderUpdated])

  useEffect(() => {
    socket.emit('join-room', 'admin')

    const handleNewOrder = (order: Order) => {
      if (newOrderCb.current) {
        newOrderCb.current(order)
      }
    }

    const handleOrderUpdated = (order: Order) => {
      if (orderUpdatedCb.current) {
        orderUpdatedCb.current(order)
      }
    }

    socket.on('new-order', handleNewOrder)
    socket.on('status-changed', handleOrderUpdated)

    return () => {
      socket.emit('leave-room', 'admin')
      socket.off('new-order', handleNewOrder)
      socket.off('status-changed', handleOrderUpdated)
    }
  }, [])
}