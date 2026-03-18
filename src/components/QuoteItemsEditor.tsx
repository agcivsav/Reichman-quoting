'use client'

import { useState, Fragment } from 'react'
import { QuoteItem } from '@/types/database'
import { createClient } from '@/lib/supabase/client'
import { AlertTriangle, Plus, Trash2, Save } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface Props {
  quoteId: string
  items: QuoteItem[]
  readOnly?: boolean
}

export function QuoteItemsEditor({ quoteId, items: initialItems, readOnly = false }: Props) {
  const [items, setItems] = useState<QuoteItem[]>(initialItems)
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  function updateItem(id: string, field: keyof QuoteItem, value: unknown) {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ))
  }

  async function addRow() {
    const { data } = await supabase.from('quote_items').insert({
      quote_id: quoteId,
      product_requested: 'New Product',
      sort_order: items.length,
    }).select().single()
    if (data) setItems(prev => [...prev, data as QuoteItem])
  }

  async function deleteRow(id: string) {
    await supabase.from('quote_items').delete().eq('id', id)
    setItems(prev => prev.filter(item => item.id !== id))
  }

  async function saveAll() {
    setSaving(true)
    for (const item of items) {
      await supabase.from('quote_items').update({
        product_quoted: item.product_quoted,
        pack_size_quoted: item.pack_size_quoted,
        quantity_quoted: item.quantity_quoted,
        unit_price: item.unit_price,
        is_substitution: item.is_substitution,
        substitution_reason: item.substitution_reason,
      }).eq('id', item.id)
    }
    setSaving(false)
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
              <th className="px-4 py-3 text-left">Product Requested</th>
              <th className="px-4 py-3 text-left">Product Quoted</th>
              <th className="px-4 py-3 text-left">Pack Size Req</th>
              <th className="px-4 py-3 text-left">Pack Size Quoted</th>
              <th className="px-4 py-3 text-left">Qty Req</th>
              <th className="px-4 py-3 text-left">Qty Quoted</th>
              <th className="px-4 py-3 text-left">Unit Price</th>
              <th className="px-4 py-3 text-left">Total</th>
              {!readOnly && <th className="px-4 py-3 text-left">Sub?</th>}
              {!readOnly && <th className="px-4 py-3"></th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map(item => (
              <Fragment key={item.id}>
                <tr className={item.is_substitution ? 'bg-amber-50' : ''}>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1.5">
                      {item.is_substitution && <AlertTriangle size={14} className="text-amber-500 flex-shrink-0" />}
                      <span className="text-gray-700">{item.product_requested}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {readOnly ? (
                      <span>{item.product_quoted || '—'}</span>
                    ) : (
                      <input
                        type="text"
                        value={item.product_quoted || ''}
                        onChange={e => updateItem(item.id, 'product_quoted', e.target.value)}
                        className="w-full border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Quote product..."
                      />
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{item.pack_size_requested || '—'}</td>
                  <td className="px-4 py-3">
                    {readOnly ? (
                      <span>{item.pack_size_quoted || '—'}</span>
                    ) : (
                      <input
                        type="text"
                        value={item.pack_size_quoted || ''}
                        onChange={e => updateItem(item.id, 'pack_size_quoted', e.target.value)}
                        className="border border-gray-200 rounded px-2 py-1 text-sm w-28 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{item.quantity_requested ?? '—'}</td>
                  <td className="px-4 py-3">
                    {readOnly ? (
                      <span>{item.quantity_quoted ?? '—'}</span>
                    ) : (
                      <input
                        type="number"
                        value={item.quantity_quoted || ''}
                        onChange={e => updateItem(item.id, 'quantity_quoted', parseFloat(e.target.value))}
                        className="border border-gray-200 rounded px-2 py-1 text-sm w-20 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {readOnly ? (
                      <span>{formatCurrency(item.unit_price)}</span>
                    ) : (
                      <input
                        type="number"
                        step="0.01"
                        value={item.unit_price || ''}
                        onChange={e => updateItem(item.id, 'unit_price', parseFloat(e.target.value))}
                        className="border border-gray-200 rounded px-2 py-1 text-sm w-24 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {item.unit_price && item.quantity_quoted
                      ? formatCurrency(item.unit_price * item.quantity_quoted)
                      : '—'}
                  </td>
                  {!readOnly && (
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={item.is_substitution}
                        onChange={e => updateItem(item.id, 'is_substitution', e.target.checked)}
                        className="rounded"
                        title="Mark as substitution"
                      />
                    </td>
                  )}
                  {!readOnly && (
                    <td className="px-4 py-3">
                      <button
                        onClick={() => deleteRow(item.id)}
                        className="text-gray-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  )}
                </tr>
                {item.is_substitution && (
                  <tr className="bg-amber-50 border-b border-amber-100">
                    <td colSpan={readOnly ? 8 : 10} className="px-4 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-amber-700 font-medium">Substitution reason:</span>
                        {readOnly ? (
                          <span className="text-xs text-amber-600">{item.substitution_reason || 'No reason given'}</span>
                        ) : (
                          <input
                            type="text"
                            value={item.substitution_reason || ''}
                            onChange={e => updateItem(item.id, 'substitution_reason', e.target.value)}
                            placeholder="e.g. floor stock, no longer made..."
                            className="flex-1 border border-amber-200 rounded px-2 py-1 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={10} className="px-4 py-8 text-center text-gray-400 text-sm">
                  No products yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {!readOnly && (
        <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
          <button
            onClick={addRow}
            className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            <Plus size={14} />
            Add product row
          </button>
          <button
            onClick={saveAll}
            disabled={saving}
            className="flex items-center gap-1.5 text-sm bg-[#1e3a5f] text-white px-4 py-1.5 rounded-lg hover:bg-[#2d5487] transition-colors disabled:opacity-50"
          >
            <Save size={14} />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      )}
    </div>
  )
}
