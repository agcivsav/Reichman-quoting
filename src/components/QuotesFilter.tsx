'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Search } from 'lucide-react'
import { useCallback } from 'react'

interface SalesRep { id: string; full_name: string | null }

export function QuotesFilter({ salesReps }: { salesReps: SalesRep[] }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const updateParams = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    router.push(`${pathname}?${params.toString()}`)
  }, [router, pathname, searchParams])

  return (
    <div className="flex flex-wrap gap-3 mb-4">
      {/* Search */}
      <div className="relative flex-1 min-w-48">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by customer or company..."
          defaultValue={searchParams.get('search') || ''}
          onChange={e => updateParams('search', e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />
      </div>

      {/* Status filter */}
      <select
        defaultValue={searchParams.get('status') || 'all'}
        onChange={e => updateParams('status', e.target.value === 'all' ? '' : e.target.value)}
        className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
      >
        <option value="all">All Statuses</option>
        <option value="new">New</option>
        <option value="open">Open</option>
        <option value="quoting">Quoting</option>
        <option value="agreed">Agreed</option>
        <option value="closed">Closed</option>
      </select>

      {/* Sales rep filter */}
      {salesReps.length > 0 && (
        <select
          defaultValue={searchParams.get('rep') || ''}
          onChange={e => updateParams('rep', e.target.value)}
          className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">All Reps</option>
          {salesReps.map(rep => (
            <option key={rep.id} value={rep.id}>{rep.full_name}</option>
          ))}
        </select>
      )}
    </div>
  )
}
