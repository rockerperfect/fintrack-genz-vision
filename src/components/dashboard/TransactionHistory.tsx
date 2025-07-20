/**
 * TransactionHistory.tsx
 *
 * Displays a list of recent transactions for the user.
 * - Shows transaction amount, description, category, date, and type.
 * - Uses mock data for demonstration; replace with API integration for production.
 * - Responsive and accessible design.
 *
 * Dependencies:
 * - React
 * - UI primitives: Card
 *
 * TODO: Add pagination, filtering, and backend integration.
 */
import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import transactions from "@/data/mock-transactions.json"

interface Transaction {
  id: string
  amount: number
  description: string
  category: string
  timestamp: string
  type: "income" | "expense"
}

function getLocalTransactions() {
  return JSON.parse(localStorage.getItem('transactions') || '[]')
}

export function TransactionHistory() {
  const [transactions, setTransactions] = React.useState(getLocalTransactions())

  React.useEffect(() => {
    function updateTxns() {
      setTransactions(getLocalTransactions())
    }
    window.addEventListener('transactionsUpdated', updateTxns)
    // Initial load
    updateTxns()
    return () => window.removeEventListener('transactionsUpdated', updateTxns)
  }, [])

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="divide-y divide-border">
          {transactions.length === 0 ? (
            <li className="py-3 text-muted-foreground">No transactions yet.</li>
          ) : (
            transactions.map((txn) => (
              <li key={txn.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-medium text-card-foreground">
                    {txn.description}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {txn.category} &middot; {new Date(txn.timestamp).toLocaleDateString()}
                  </div>
                </div>
                <div className={txn.type === "income" ? "text-green-600" : "text-red-600"}>
                  {txn.type === "income" ? "+" : "-"}${txn.amount.toFixed(2)}
                </div>
              </li>
            ))
          )}
        </ul>
      </CardContent>
    </Card>
  )
}
