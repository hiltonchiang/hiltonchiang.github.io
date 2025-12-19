'use client'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

// Example stock data (replace with your actual fetched data)
const stockData = [
  { date: '2025-11-01', price: 100 },
  { date: '2025-11-02', price: 105 },
  { date: '2025-11-03', price: 110 },
  // ... more data points
]

export interface StockLineChartProps {
  date: string
  price: number
}
interface SdataProps {
  sData: StockLineChartProps[]
}
/**
 *
 */
function StockLineChart({ sData }: SdataProps) {
  return (
    // Use ResponsiveContainer for charts that adapt to screen size
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={stockData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" /> {/* Key for the dates */}
        <YAxis /> {/* Automatically handles price scale */}
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="price" // Key for the stock price
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default StockLineChart
