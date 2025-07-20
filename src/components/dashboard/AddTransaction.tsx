/**
 * AddTransaction.tsx
 *
 * Form to add a new transaction (income or expense).
 * - Validates input and updates transaction list (mock for now).
 * - Responsive and accessible design.
 *
 * Dependencies:
 * - React
 * - UI primitives: Card, Button
 *
 * TODO: Integrate with backend and update dashboard on submit.
 */
import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function AddTransaction() {
  const [form, setForm] = React.useState({
    amount: "",
    description: "",
    category: "",
    type: "expense"
  })
  const [submitted, setSubmitted] = React.useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const newTxn = {
      id: `txn_${Date.now()}`,
      amount: parseFloat(form.amount),
      description: form.description,
      category: form.category,
      timestamp: new Date().toISOString(),
      type: form.type
    }
    // Get existing transactions from localStorage
    const txns = JSON.parse(localStorage.getItem('transactions') || '[]')
    txns.unshift(newTxn)
    localStorage.setItem('transactions', JSON.stringify(txns))
    setSubmitted(true)
    setForm({ amount: "", description: "", category: "", type: "expense" })
    // Notify other components
    window.dispatchEvent(new Event('transactionsUpdated'))
  }

  return (
    <Card className="mt-6 max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Add Transaction</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            name="amount"
            type="number"
            placeholder="Amount"
            value={form.amount}
            onChange={handleChange}
            className="input input-bordered"
            required
          />
          <input
            name="description"
            type="text"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="input input-bordered"
            required
          />
          <input
            name="category"
            type="text"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
            className="input input-bordered"
            required
          />
          <select name="type" value={form.type} onChange={handleChange} className="input input-bordered">
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
          <button type="submit" className="mt-2 px-4 py-2 bg-primary text-white rounded-lg">Add</button>
          {submitted && <div className="text-success mt-2">Transaction added (mock)!</div>}
        </form>
      </CardContent>
    </Card>
  )
}
