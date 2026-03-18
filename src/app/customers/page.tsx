export const dynamic = 'force-dynamic'
import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import { Users } from 'lucide-react'

export default async function CustomersPage() {
  const supabase = await createClient()

  const { data: customers } = await supabase
    .from('profiles')
    .select(`
      *,
      quotes(id, status)
    `)
    .eq('role', 'customer')
    .order('created_at', { ascending: false })

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-500 mt-1">{customers?.length ?? 0} total customers</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Company</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">License #</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Quotes</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {customers?.map(customer => (
              <tr key={customer.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{customer.full_name || '—'}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{customer.company_name || '—'}</td>
                <td className="px-4 py-3 text-sm text-blue-600">{customer.email || '—'}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{customer.phone || '—'}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{customer.license_number || '—'}</td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {[customer.city, customer.state].filter(Boolean).join(', ') || '—'}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {(customer.quotes as unknown[])?.length ?? 0}
                </td>
                <td className="px-4 py-3 text-sm text-gray-400">{formatDate(customer.created_at)}</td>
              </tr>
            ))}
            {(!customers || customers.length === 0) && (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-gray-400">No customers yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
