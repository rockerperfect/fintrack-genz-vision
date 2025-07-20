/**
 * AddTransaction.tsx
 *
 * Enhanced form to add new transactions with improved UI/UX.
 * - Professional form design with validation and feedback
 * - Category suggestions and amount formatting
 * - Real-time balance updates and transaction persistence
 * - Mobile-first responsive design with touch-friendly inputs
 *
 * Dependencies:
 * - React hooks for state management
 * - UI primitives: Card, Button, Input, Select, Badge
 * - Lucide icons for visual enhancement
 *
 * Features:
 * - Smart category suggestions
 * - Amount formatting and validation
 * - Success feedback with animations
 * - Integration with localStorage and dashboard updates
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  Plus, 
  Minus, 
  CheckCircle, 
  AlertCircle,
  Coffee,
  Car,
  Home,
  ShoppingCart,
  Utensils,
  CreditCard,
  Briefcase,
  Gift
} from 'lucide-react';

interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: string;
  timestamp: string;
  type: 'income' | 'expense';
}

interface FormData {
  amount: string;
  description: string;
  category: string;
  type: 'income' | 'expense';
}

const expenseCategories = [
  { name: 'Food & Dining', icon: Utensils, color: 'bg-orange-100 text-orange-700' },
  { name: 'Transportation', icon: Car, color: 'bg-blue-100 text-blue-700' },
  { name: 'Shopping', icon: ShoppingCart, color: 'bg-purple-100 text-purple-700' },
  { name: 'Entertainment', icon: Coffee, color: 'bg-pink-100 text-pink-700' },
  { name: 'Bills & Utilities', icon: Home, color: 'bg-gray-100 text-gray-700' },
  { name: 'Healthcare', icon: Plus, color: 'bg-red-100 text-red-700' },
  { name: 'Other', icon: CreditCard, color: 'bg-indigo-100 text-indigo-700' },
];

const incomeCategories = [
  { name: 'Salary', icon: Briefcase, color: 'bg-green-100 text-green-700' },
  { name: 'Freelance', icon: DollarSign, color: 'bg-emerald-100 text-emerald-700' },
  { name: 'Investment', icon: Plus, color: 'bg-teal-100 text-teal-700' },
  { name: 'Gift', icon: Gift, color: 'bg-yellow-100 text-yellow-700' },
  { name: 'Other', icon: DollarSign, color: 'bg-blue-100 text-blue-700' },
];

export function AddTransaction() {
  const [form, setForm] = useState<FormData>({
    amount: '',
    description: '',
    category: '',
    type: 'expense'
  });
  
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const categories = form.type === 'expense' ? expenseCategories : incomeCategories;

  /**
   * Handle form field changes with validation
   */
  const handleChange = (field: keyof FormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  /**
   * Format amount as user types
   */
  const handleAmountChange = (value: string) => {
    // Remove non-numeric characters except decimal point
    const cleanValue = value.replace(/[^\d.]/g, '');
    
    // Ensure only one decimal point
    const parts = cleanValue.split('.');
    if (parts.length > 2) {
      return;
    }
    
    // Limit to 2 decimal places
    if (parts[1] && parts[1].length > 2) {
      return;
    }
    
    handleChange('amount', cleanValue);
  };

  /**
   * Validate form fields
   */
  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    
    if (!form.amount || parseFloat(form.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }
    
    if (!form.description.trim()) {
      newErrors.description = 'Please enter a description';
    }
    
    if (!form.category) {
      newErrors.category = 'Please select a category';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission with enhanced feedback
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newTransaction: Transaction = {
      id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      amount: parseFloat(form.amount),
      description: form.description.trim(),
      category: form.category,
      timestamp: new Date().toISOString(),
      type: form.type
    };
    
    // Update localStorage
    const existingTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    const updatedTransactions = [newTransaction, ...existingTransactions];
    localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
    
    // Update user profile balance
    const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    const currentBalance = userProfile.balance || 5420;
    const balanceChange = form.type === 'income' ? newTransaction.amount : -newTransaction.amount;
    userProfile.balance = currentBalance + balanceChange;
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
    
    // Notify other components
    window.dispatchEvent(new Event('transactionsUpdated'));
    window.dispatchEvent(new Event('balanceUpdated'));
    
    setIsLoading(false);
    setIsSubmitted(true);
    
    // Reset form
    setForm({
      amount: '',
      description: '',
      category: '',
      type: 'expense'
    });
    
    // Hide success message after 3 seconds
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-background p-4 pb-24">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-foreground">Add Transaction</h1>
          <p className="text-muted-foreground mt-2">Track your income and expenses</p>
        </div>

        {/* Success Message */}
        {isSubmitted && (
          <Card className="border-success/20 bg-success/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 text-success">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Transaction added successfully!</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Transaction Type Toggle */}
        <Card className="border shadow-sm bg-card">
          <CardContent className="p-4">
            <Label className="text-sm font-medium text-muted-foreground">Transaction Type</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <Button
                type="button"
                variant={form.type === 'expense' ? 'default' : 'outline'}
                onClick={() => {
                  handleChange('type', 'expense');
                  handleChange('category', ''); // Reset category when type changes
                }}
                className="h-12 flex items-center gap-2"
              >
                <Minus className="w-4 h-4" />
                Expense
              </Button>
              <Button
                type="button"
                variant={form.type === 'income' ? 'default' : 'outline'}
                onClick={() => {
                  handleChange('type', 'income');
                  handleChange('category', ''); // Reset category when type changes
                }}
                className={`h-12 flex items-center gap-2 ${
                  form.type === 'income' 
                    ? 'bg-success hover:bg-success/90 text-success-foreground' 
                    : ''
                }`}
              >
                <Plus className="w-4 h-4" />
                Income
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Form */}
        <Card className="border shadow-sm bg-card">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary" />
              {form.type === 'expense' ? 'New Expense' : 'New Income'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Amount Input */}
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="amount"
                    type="text"
                    placeholder="0.00"
                    value={form.amount}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    className={`pl-10 h-12 text-lg ${errors.amount ? 'border-destructive' : ''}`}
                    required
                  />
                </div>
                {errors.amount && (
                  <div className="flex items-center gap-1 text-destructive text-sm">
                    <AlertCircle className="w-3 h-3" />
                    {errors.amount}
                  </div>
                )}
              </div>

              {/* Description Input */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  type="text"
                  placeholder="What was this for?"
                  value={form.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  className={`h-12 ${errors.description ? 'border-destructive' : ''}`}
                  required
                />
                {errors.description && (
                  <div className="flex items-center gap-1 text-destructive text-sm">
                    <AlertCircle className="w-3 h-3" />
                    {errors.description}
                  </div>
                )}
              </div>

              {/* Category Selection */}
              <div className="space-y-2">
                <Label>Category</Label>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((category) => {
                    const Icon = category.icon;
                    const isSelected = form.category === category.name;
                    return (
                      <Button
                        key={category.name}
                        type="button"
                        variant="outline"
                        onClick={() => handleChange('category', category.name)}
                        className={`h-16 flex flex-col items-center gap-1 p-3 ${
                          isSelected 
                            ? 'border-primary bg-primary/10 text-primary' 
                            : 'hover:bg-muted/50'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-xs text-center leading-tight">
                          {category.name.length > 12 
                            ? category.name.split(' ')[0] 
                            : category.name
                          }
                        </span>
                      </Button>
                    );
                  })}
                </div>
                {errors.category && (
                  <div className="flex items-center gap-1 text-destructive text-sm">
                    <AlertCircle className="w-3 h-3" />
                    {errors.category}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className={`w-full h-12 text-base font-medium ${
                  form.type === 'income'
                    ? 'bg-success hover:bg-success/90 text-success-foreground'
                    : 'bg-primary hover:bg-primary/90 text-primary-foreground'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Adding...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add {form.type === 'expense' ? 'Expense' : 'Income'}
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Quick Amount Suggestions */}
        {form.type === 'expense' && (
          <Card className="border shadow-sm bg-card">
            <CardContent className="p-4">
              <Label className="text-sm font-medium text-muted-foreground mb-3 block">Quick Amounts</Label>
              <div className="grid grid-cols-4 gap-2">
                {['5', '10', '25', '50'].map((amount) => (
                  <Button
                    key={amount}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleChange('amount', amount)}
                    className="h-9 text-sm"
                  >
                    ${amount}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
