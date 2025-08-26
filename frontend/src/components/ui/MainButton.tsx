import React from 'react'

interface buttonProps {
    title: string,
    onPress?: () => void,
    icon?: React.ReactNode 
    classe: 'primary' | 'secondary'
    disabled?: boolean,
    type: 'submit'| 'button'
}

function MainButton({title, onPress, icon, classe, disabled, type}: buttonProps) {
  return (
    <button onClick={onPress} type={type} disabled={disabled} className={classe === 'primary' ? 'flex items-center justify-center gap-2 bg-orange-600 text-white shadow rounded font-semibold p-2 hover:scale-105 hover:shadow-2xl transition-all duration-500 disabled:bg-orange-300' : '' }>{icon} {title}</button>
  )
}

export default MainButton