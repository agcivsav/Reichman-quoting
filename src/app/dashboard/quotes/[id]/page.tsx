export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Quote, QuoteStatus } from '@/types/database'
import { StatusBadge } from '@/components/StatusBadge'
import { formatDate, formatDateTime, formatCurrency } from '@/lib/utils'
import { QuoteItemsEditor } from '@/components/QuoteItemsEditor'
import { MessageThread } from '@/components/MessageThread'
import { QuoteActions } from '@/components/QuoteActions'

async function getQuote(id: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('quotes')
    .select(`
      *,
      customer:profiles!quotes_customer_id_fkey(*),
      sales_rep:profiles!quotes_sales_rep_id_fkey(id, full_name, email),
      quote_items(*),
      quote_messages(*)
    `)
    .eq('id', id)
    .single()
  return data as Quote | null
}

async function getSalesReps() {
  const supabase = await createClient()
  const { data } = await supabase.from('profiles').select('id, full_name').eq('role', 'sales_rep')
  return data || []
}

async function getCurrentUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  return profile
}

export default async function QuoteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [quote, salesReps, currentUser] = await Promise.all([
    getQuote(id),
    getSalesReps(),
    getCurrentUser(),
  ])

  if (!quote) notFound()

  const customer = quote.customer as Record<string, string> | undefined
  const salesRep = quote.sales_rep as Record<string, string> | undefined

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Top bar */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-gray-900">Quote #{quote.quote_number}</h1>
            <StatusBadge status={quote.status as QuoteStatus} />
          </div>
          <p className="text-sm text-gray-500">
            Submitted {formatDateTime(quote.created_at)} · Source: <span className="capitalize">{quote.source.replace('_', ' ')}</span>
          </p>
        </div>
        <QuoteActions
          quoteId={quote.id}
          currentStatus={quote.status as QuoteStatus}
          salesReps={salesReps}
          currentSalesRepId={quote.sales_rep_id}
          currentUser={currentUser}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Products + Messages */}
        <div className="lg:col-span-2 space-y-6">

          {/* Products Table */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Products</h2>
              <span className="text-xs text-gray-400">{quote.quote_items?.length ?? 0} item(s)</span>
            </div>
            <QuoteItemsEditor
              quoteId={quote.id}
              items={quote.quote_items || []}
              readOnly={currentUser?.role === 'customer'}
            />
          </div>

          {/* Messages */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Messages</h2>
            </div>
            <MessageThread
              quoteId={quote.id}
              messages={quote.quote_messages || []}
              currentUser={currentUser}
            />
          </div>
        </div>

        {/* Right: Sidebar */}
        <div className="space-y-4">
          {/* Customer Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Customer</h3>
            <dl className="space-y-2.5">
              <InfoRow label="Name" value={customer?.full_name} />
              <InfoRow label="Company" value={quote.customer_company || customer?.company_name} />
              <InfoRow label="Email" value={customer?.email} />
              <InfoRow label="Phone" value={quote.customer_phone || customer?.phone} />
              <InfoRow label="License #" value={quote.customer_license || customer?.license_number} />
              <InfoRow
                label="Location"
                value={[customer?.city, customer?.state].filter(Boolean).join(', ')}
              />
            </dl>
          </div>

          {/* Sales Rep */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900 mb-3">Sales Rep</h3>
            {salesRep ? (
              <div>
                <p className="font-medium text-gray-800">{salesRep.full_name}</p>
                <p className="text-sm text-gray-500">{salesRep.email}</p>
              </div>
            ) : (
              <p className="text-sm text-orange-500 font-medium">Unassigned</p>
            )}
          </div>

          {/* Internal Notes */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900 mb-3">Internal Notes</h3>
            <NotesEditor quoteId={quote.id} initialNotes={quote.notes || ''} readOnly={currentUser?.role === 'customer'} />
          </div>

          {/* Quote Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900 mb-3">Quote Info</h3>
            <dl className="space-y-2">
              <InfoRow label="Quote #" value={`#${quote.quote_number}`} />
              <InfoRow label="Created" value={formatDate(quote.created_at)} />
              <InfoRow label="Updated" value={formatDate(quote.updated_at)} />
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex gap-2">
      <dt className="text-xs font-medium text-gray-400 w-20 flex-shrink-0 pt-0.5">{label}</dt>
      <dd className="text-sm text-gray-800">{value || '—'}</dd>
    </div>
  )
}

function NotesEditor({ quoteId, initialNotes, readOnly }: { quoteId: string; initialNotes: string; readOnly: boolean }) {
  // For now rendered as static; editing handled client-side via QuoteActions
  return (
    <p className="text-sm text-gray-600 whitespace-pre-wrap">
      {initialNotes || <span className="text-gray-400 italic">No notes yet</span>}
    </p>
  )
}
