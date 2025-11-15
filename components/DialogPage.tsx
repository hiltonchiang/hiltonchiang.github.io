'use client'
import dynamic from 'next/dynamic'

const DialogFamily = dynamic(() => import('@/components/DialogFamily'), {
  ssr: false,
})

const DialogPage = () => {
  return <DialogFamily />
}
export default DialogPage
