import FamilyTreeRoot from '@/components/FamilyTreeRoot'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import DialogPage from '@/components/DialogPage'

export default async function Page() {
  const cookieStore = await cookies()
  const authToken = cookieStore.get('auth_token')
  let blurFlag = false
  if (!authToken) {
    blurFlag = true
  }
  return (
    <>
      <div id="main-family-page" data-blur="true" className="">
        <ScrollTopAndComment />
        <div className="realtive hidden w-screen max-w-[1088px] divide-y border-2 border-solid p-4 md:w-full">
          <FamilyTreeRoot />
        </div>
      </div>
      <div id="ThreeCanvas" />
      <DialogPage />
    </>
  )
}
