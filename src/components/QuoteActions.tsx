'use client'

import { useState } from 'react'
import { QuoteStatus, Profile } from '@/types/database'
import { STATUS_CONFIG } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { ChevronDown } from 'lucide-react'

interface SalesRep { id: string; full_name: string | null }

interface Props {
  quoteId: string
  currentStatus: QuoteStatus
  salesReps: SalesRep[]
  currentSalesRepId: string | null
  currentUser: Profile | null
}

const STATUSES: QuoteStatus[] = ['new', 'open', 'quoting', 'agreed', 'closed']

export function QuoteActions({ quoteId, currentStatus, salesReps, currentSalesRepId, currentUser }: Props) {
  const [status, setStatus] = useState<QuoteStatus>(currentStatus)
  const [salesRepId, setSalesRepId] = useState(currentSalesRepId || '')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()
  const isStaff = currentUser?.role === 'admin' || currentUser?.role === 'sales_rep'

  async function updateStatus(newStatus: QuoteStatus) {
    setLoading(true)
    await supabase.from('quotes').update({ status: newStatus }).eq('id', quoteId)
    setStatus(newStatus)
    setLoading(false)
    router.refresh()
  }

  async function updateSalesRep(repId: string) {
    setLoading(true)
    await supabase.from('quotes').update({ sales_rep_id: repId || null }).eq('id', quoteId)
    setSalesRepId(repId)
    setLoading(false)
    router.refresh()
  }

  async function acceptQuote() {
    await updateStatus('agreed')
  }

  if (!isStaff) return null

  return (
    <div className="flex items-center gap-3">
      {/* Sales Rep Assign (admin only) */}
      {currentUser?.role === 'admin' && (
        <div>
          <select
            value={salesRepId}
            onChange={e => updateSalesRep(e.target.value)}
            disabled={loading}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">Assign Rep...</option>
            {salesReps.map(rep => (
              <option key={rep.id} value={rep.id}>{rep.full_name}</option>
            ))}
          </select>
        </div>
      )}

      {/* Status Dropdown */}
      <div className="relative">
        <select
          value={status}
          onChange={e => updateStatus(e.target.value as QuoteStatus)}
          disabled={loading}
          className="appearance-none border border-gray-200 rounded-lg pl-3 pr-8 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
        >
          {STATUSES.map(s => (
            <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
          ))}
        </select>
        <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
      </div>

      {/* Accept Button */}
      {status !== 'agreed' && status !== 'closed' && (
        <button
          onClick={acceptQuote}
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
        >
          Accept Quote
        </button>
      )}

      {status === 'agreed' && (
        <span className="bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm font-semibold border border-green-200">
          ✓ Agreed
        </span>
      )}
    </div>
  )
}
