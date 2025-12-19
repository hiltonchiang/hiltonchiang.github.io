import RealTimePrice from '@/components/RealTimePrice'

export default async function Page() {
  return (
    <>
      <div id="main-finnhub" data-blur="true" className="">
        <RealTimePrice symbol="SOXL" />
      </div>
    </>
  )
}
