'use client'
import dynamic from 'next/dynamic'

const DialogFamily = dynamic(() => import('@/components/DialogFamily'), {
  ssr: false,
})

const DialogPage = (onDialogClosed) => {
  return <DialogFamily onDialogClosed={onDialogClosed} />
}
export default DialogPage
