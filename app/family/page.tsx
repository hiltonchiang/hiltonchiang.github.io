import FamilyTree1 from '@/components/FamilyTree1'
import FamilyTree2 from '@/components/FamilyTree2'

export default async function Page() {
  return (
    <>
      <div className="realtive md w-screen max-w-[1088px] border-2 border-solid p-4 md:w-full">
        <FamilyTree1 />
        <FamilyTree2 />
      </div>
    </>
  )
}
