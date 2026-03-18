import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const apiKey = request.nextUrl.searchParams.get('api_key')

  const configuredKey = process.env.QUOTES_API_KEY
  if (configuredKey && apiKey !== configuredKey) {
    return NextResponse.json({ error: 'Invalid API key' }, { status: 401 })
  }

  const supabase = createServiceClient()

  const { data: quote, error } = await supabase
    .from('quotes')
    .select(`
      id,
      quote_number,
      status,
      created_at,
      updated_at,
      quote_items(
        id,
        product_requested,
        product_quoted,
        pack_size_requested,
        pack_size_quoted,
        quantity_requested,
        quantity_quoted,
        unit_price,
        is_substitution,
        substitution_reason
      ),
      quote_messages(
        id,
        sender_name,
        message,
        is_internal,
        created_at
      )
    `)
    .eq('id', id)
    .eq('quote_messages.is_internal', false) // Only return non-internal messages
    .single()

  if (error || !quote) {
    return NextResponse.json({ error: 'Quote not found' }, { status: 404 })
  }

  return NextResponse.json(quote)
}
