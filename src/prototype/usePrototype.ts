import { useContext } from 'react'
import { PrototypeContext } from './PrototypeContext'

export function usePrototype() {
  const value = useContext(PrototypeContext)
  if (!value) throw new Error('usePrototype must be used inside <PrototypeProvider>')
  return value
}
