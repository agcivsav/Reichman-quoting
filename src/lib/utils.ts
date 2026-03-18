import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { QuoteStatus } from '@/types/database'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number | null): string {
  if (amount === null || amount === undefined) return '—'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export const STATUS_CONFIG: Record<QuoteStatus, { label: string; className: string }> = {
  new:     { label: 'New',     className: 'bg-orange-100 text-orange-800 border-orange-200' },
  open:    { label: 'Open',    className: 'bg-blue-100 text-blue-800 border-blue-200' },
  quoting: { label: 'Quoting', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  agreed:  { label: 'Agreed',  className: 'bg-green-100 text-green-800 border-green-200' },
  closed:  { label: 'Closed',  className: 'bg-gray-100 text-gray-600 border-gray-200' },
}
