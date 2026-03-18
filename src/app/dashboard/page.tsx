export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { Quote, QuoteStatus } from '@/types/database'
import { StatusBadge } from '@/components/StatusBadge'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import { FileText, TrendingUp, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { QuotesFilter } from '@/components/QuotesFilter'

async function getQuotes(search?: string, status?: string, salesRepId?: string) {
  const supabase = await createClient()

  let query = supabase
    .from('quotes')
    .select(`
      *,
      customer:profiles!quotes_customer_id_fkey(id, full_name, email, company_name, city, state),
      sales_rep:profiles!quotes_sales_rep_id_fkey(id, full_name, email),
      quote_items(id)
    `)
    .order('created_at', { ascending: false })

  if (status && status !== 'all') {
    query = query.eq('status', status)
  }
  if (salesRepId) {
    query = query.eq('sales_rep_id', salesRepId)
  }
  if (search) {
    query = query.or(`customer_company.ilike.%${search}%,customer.full_name.ilike.%${search}%`)
  }

  const { data } = await query
  return data as Quote[] | null
}

async function getStats() {
  const supabase = await createClient()
  const { data } = await supabase.from('quotes').select('status')
  if (!data) return { total: 0, new: 0, open: 0, quoting: 0, agreed: 0 }
  return {
    total:   data.length,
    new:     data.filter(q => q.status === 'new').length,
    open:    data.filter(q => q.status === 'open').length,
    quoting: data.filter(q => q.status === 'quoting').length,
    agreed:  data.filter(q => q.status === 'agreed').length,
  }
}

async function getSalesReps() {
  const supabase = await createClient()
  const { data } = await supabase.from('profiles').select('id, full_name').eq('role', 'sales_rep')
  return data || []
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string; rep?: string }>
}) {
  const params = await searchParams
  const [quotes, stats, reps] = await Promise.all([
    getQuotes(params.search, params.status, params.rep),
    getStats(),
    getSalesReps(),
  ])

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">All Quotes</h1>
        <p className="text-gray-500 mt-1">Manage and track all incoming quote requests</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatCard label="Total" value={stats.total} icon={<FileText size={20} className="text-gray-500" />} color="gray" />
        <StatCard label="New" value={stats.new} icon={<AlertCircle size={20} className="text-orange-500" />} color="orange" />
        <StatCard label="Open" value={stats.open} icon={<Clock size={20} className="text-blue-500" />} color="blue" />
        <StatCard label="Quoting" value={stats.quoting} icon={<TrendingUp size={20} className="text-yellow-500" />} color="yellow" />
        <StatCard label="Agreed" value={stats.agreed} icon={<CheckCircle size={20} className="text-green-500" />} color="green" />
      </div>

      {/* Filters */}
      <QuotesFilter salesReps={reps} />

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Quote #</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Company</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Sales Rep</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Items</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {quotes?.map((quote) => (
              <Link key={quote.id} href={`/dashboard/quotes/${quote.id}`} legacyBehavior>
                <tr
                  className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                    quote.status === 'new' ? 'border-l-4 border-l-orange-400' : ''
                  }`}
                >
                  <td className="px-4 py-3 text-sm font-medium text-blue-600">
                    #{quote.quote_number}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {quote.customer?.full_name || '—'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {quote.customer_company || quote.customer?.company_name || '—'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {[quote.customer?.city, quote.customer?.state].filter(Boolean).join(', ') || '—'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {quote.sales_rep?.full_name || <span className="text-orange-500 text-xs font-medium">Unassigned</span>}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={quote.status as QuoteStatus} />
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {(quote.quote_items as unknown[])?.length ?? 0}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400">
                    {formatDate(quote.created_at)}
                  </td>
                </tr>
              </Link>
            ))}
            {(!quotes || quotes.length === 0) && (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-gray-400">
                  No quotes found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function StatCard({ label, value, icon, color }: { label: string; value: number; icon: React.ReactNode; color: string }) {
  const colors: Record<string, string> = {
    gray:   'bg-gray-50 border-gray-200',
    orange: 'bg-orange-50 border-orange-200',
    blue:   'bg-blue-50 border-blue-200',
    yellow: 'bg-yellow-50 border-yellow-200',
    green:  'bg-green-50 border-green-200',
  }
  return (
    <div className={`rounded-xl border p-4 ${colors[color]}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-gray-500 uppercase">{label}</span>
        {icon}
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  )
}
