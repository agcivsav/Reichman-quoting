import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { ExternalQuotePayload } from '@/types/database'

export async function POST(request: NextRequest) {
  try {
    const body: ExternalQuotePayload = await request.json()

    // Validate API key (skip in dev if no key configured)
    const configuredKey = process.env.QUOTES_API_KEY
    if (configuredKey && body.api_key !== configuredKey) {
      return NextResponse.json({ error: 'Invalid API key' }, { status: 401 })
    }

    if (!body.customer?.email) {
      return NextResponse.json({ error: 'Customer email is required' }, { status: 400 })
    }

    if (!body.cart_items?.length) {
      return NextResponse.json({ error: 'At least one cart item is required' }, { status: 400 })
    }

    const supabase = createServiceClient()

    // Find or create user account for the customer
    let customerId: string | null = null

    // Check if user already exists by email
    const { data: existingProfiles } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', body.customer.email)
      .single()

    if (existingProfiles) {
      customerId = existingProfiles.id
    } else {
      // Create a new user account
      const { data: newUser, error: authError } = await supabase.auth.admin.createUser({
        email: body.customer.email,
        email_confirm: true,
        user_metadata: {
          full_name: body.customer.full_name,
        },
      })

      if (authError) {
        console.error('Error creating user:', authError)
        // Continue even if we can't create user — quote will have no customer_id
      } else {
        customerId = newUser.user.id

        // Update the profile with additional info
        await supabase.from('profiles').upsert({
          id: customerId,
          email: body.customer.email,
          full_name: body.customer.full_name,
          phone: body.customer.phone,
          company_name: body.customer.company,
          license_number: body.customer.license_number,
          address: body.customer.address,
          city: body.customer.city,
          state: body.customer.state,
          zip: body.customer.zip,
          role: 'customer',
        })
      }
    }

    // Create the quote
    const { data: quote, error: quoteError } = await supabase
      .from('quotes')
      .insert({
        customer_id: customerId,
        status: 'new',
        source: body.source || 'external_site',
        customer_company: body.customer.company,
        customer_phone: body.customer.phone,
        customer_license: body.customer.license_number,
        cart_data: body.cart_items as unknown as Record<string, unknown>,
      })
      .select('id, quote_number')
      .single()

    if (quoteError || !quote) {
      console.error('Error creating quote:', quoteError)
      return NextResponse.json({ error: 'Failed to create quote' }, { status: 500 })
    }

    // Create quote items
    const quoteItems = body.cart_items.map((item, idx) => ({
      quote_id: quote.id,
      product_requested: item.product_name,
      pack_size_requested: item.pack_size || null,
      quantity_requested: item.quantity,
      sort_order: idx,
    }))

    await supabase.from('quote_items').insert(quoteItems)

    // Email notification (placeholder — integrate Resend/SendGrid here)
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@reichmansales.com'
    console.log(`[EMAIL] New quote #${quote.quote_number} from ${body.customer.email} (${body.customer.company}). Notify: ${adminEmail}`)

    return NextResponse.json({
      success: true,
      quote_id: quote.id,
      quote_number: quote.quote_number,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    const details = error instanceof Error ? error.stack : String(error)
    console.error('External quote API error:', message, details)
    const isDev = process.env.NODE_ENV === 'development'
    return NextResponse.json(
      {
        error: 'Internal server error',
        ...(isDev && { details: message }),
      },
      { status: 500 }
    )
  }
}

// Allow CORS from the external site
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
