/**
 * Analytics.tsx
 *
 * Displays financial analytics and insights for the user.
 * - Shows spending breakdown by category, monthly trends, and savings rate.
 * - Uses mock data for demonstration; replace with API integration for production.
 * - Responsive and accessible design.
 *
 * Dependencies:
 * - React
 * - UI primitives: Card
 * - Chart library (TODO: integrate charting library)
 *
 * TODO: Add interactive charts, filtering, and backend integration.
 */
import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

function getLocalTransactions() {
  return JSON.parse(localStorage.getItem('transactions') || '[]')
}

/**
 * Transaction interface for analytics calculations.
 * @property {string} category - Transaction category (e.g., Food, Rent).
 * @property {string} type - Transaction type ('income' or 'expense').
 * @property {number} amount - Transaction amount.
 * @property {string | number | Date} timestamp - Transaction timestamp.
 */
interface Transaction {
  category: string
  type: "income" | "expense"
  amount: number | string
  timestamp: string | number | Date
}

function calculateAnalytics(transactions: Transaction[]) {
  // Spending by category
  const spendingByCategory: Record<string, number> = {}
  let totalIncome = 0
  let totalExpense = 0
  const monthlyTrends: Record<string, { spent: number; saved: number }> = {}
  transactions.forEach(txn => {
    // Category breakdown
    if (!spendingByCategory[txn.category]) spendingByCategory[txn.category] = 0
    spendingByCategory[txn.category] += Number(txn.amount)
    // Income/expense totals
    if (txn.type === 'income') totalIncome += Number(txn.amount)
    else totalExpense += Number(txn.amount)
    // Monthly trends
    const month = new Date(txn.timestamp).toLocaleString('default', { month: 'short', year: 'numeric' })
    if (!monthlyTrends[month]) monthlyTrends[month] = { spent: 0, saved: 0 }
    if (txn.type === 'income') monthlyTrends[month].saved += Number(txn.amount)
    else monthlyTrends[month].spent += Number(txn.amount)
  })
  // Format for UI
  return {
    spendingByCategory: Object.entries(spendingByCategory).map(([category, amount]) => ({ category, amount: Number(amount) })),
    monthlyTrends: Object.entries(monthlyTrends).map(([month, data]) => ({ month, spent: data.spent, saved: data.saved })),
    savingsRate: totalIncome === 0 ? 0 : Math.round((totalIncome - totalExpense) / totalIncome * 100)
  }
}

export function Analytics() {
  const [analytics, setAnalytics] = React.useState(calculateAnalytics(getLocalTransactions()))

  React.useEffect(() => {
    function updateAnalytics() {
      setAnalytics(calculateAnalytics(getLocalTransactions()))
    }
    window.addEventListener('transactionsUpdated', updateAnalytics)
    updateAnalytics()
    return () => window.removeEventListener('transactionsUpdated', updateAnalytics)
  }, [])

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Financial Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Spending by Category</h3>
          <ul className="space-y-1">
            {analytics.spendingByCategory.map((cat) => (
              <li key={cat.category} className="flex justify-between">
                <span>{cat.category}</span>
                <span className="font-medium">${Number(cat.amount).toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Monthly Trends</h3>
          <ul className="space-y-1">
            {analytics.monthlyTrends.map((trend) => (
              <li key={trend.month} className="flex justify-between">
                <span>{trend.month}</span>
                <span className="text-red-600">Spent: ${trend.spent.toFixed(2)}</span>
                <span className="text-green-600">Saved: ${trend.saved.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Savings Rate</h3>
          <span className="text-success font-bold text-xl">{analytics.savingsRate}%</span>
        </div>
      </CardContent>
    </Card>
  )
}
