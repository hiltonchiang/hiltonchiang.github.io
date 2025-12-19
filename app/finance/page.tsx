import YF, { YFProps } from '@/components/YahooFinance'
import { ChartOptionsWithReturnArray } from 'yahoo-finance2/esm/src/modules/chart.js'
import { getChartOptions, getAllTickers } from '@/lib/actions'
/**
 *
 */
export default async function Page() {
  const yfprops: YFProps = await getChartOptions()
  console.log('yfprops', yfprops)
  // await getAllTickers()
  return (
    <>
      <div id="main-finance-page">
        <YF symbol={yfprops.symbol} options={yfprops.options} />
      </div>
    </>
  )
}
