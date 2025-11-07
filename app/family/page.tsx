import FamilyTree1 from '@/components/FamilyTree1'
import FamilyTree2 from '@/components/FamilyTree2'
import FamilyTreeMD1 from '@/components/FamilyTreeMD1'
import FamilyTreeMD2 from '@/components/FamilyTreeMD2'
import FamilyTreeMD3 from '@/components/FamilyTreeMD3'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'

export default async function Page() {
  return (
    <>
      <div className="realtive hidden w-screen max-w-[1088px] border-2 border-solid p-4 md:block md:w-full">
        <ScrollTopAndComment />
        <FamilyTree1 />
        <FamilyTree2 />
      </div>
      <div className="md:hidden">
        <FamilyTreeMD1 />
        <FamilyTreeMD2 />
        <FamilyTreeMD3 />
      </div>
    </>
  )
}
