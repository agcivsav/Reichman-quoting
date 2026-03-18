export type Role = 'admin' | 'sales_rep' | 'customer'
export type QuoteStatus = 'new' | 'open' | 'quoting' | 'agreed' | 'closed'
export type QuoteSource = 'portal' | 'external_site' | 'manual'

export interface Profile {
  id: string
  full_name: string | null
  email: string | null
  phone: string | null
  license_number: string | null
  company_name: string | null
  address: string | null
  city: string | null
  state: string | null
  zip: string | null
  role: Role
  created_at: string
}

export interface Product {
  id: string
  name: string
  sku: string | null
  category: string | null
  description: string | null
  available_pack_sizes: string[] | null
  active: boolean
  created_at: string
}

export interface Quote {
  id: string
  quote_number: number
  customer_id: string | null
  sales_rep_id: string | null
  status: QuoteStatus
  notes: string | null
  cart_data: Record<string, unknown> | null
  customer_license: string | null
  customer_phone: string | null
  customer_company: string | null
  source: QuoteSource
  created_at: string
  updated_at: string
  // Joined fields
  customer?: Profile
  sales_rep?: Profile
  quote_items?: QuoteItem[]
  quote_messages?: QuoteMessage[]
}

export interface QuoteItem {
  id: string
  quote_id: string
  product_requested: string
  product_quoted: string | null
  pack_size_requested: string | null
  pack_size_quoted: string | null
  quantity_requested: number | null
  quantity_quoted: number | null
  unit_price: number | null
  total_price: number | null
  is_substitution: boolean
  substitution_reason: string | null
  sort_order: number
  created_at: string
}

export interface QuoteMessage {
  id: string
  quote_id: string
  sender_id: string | null
  sender_name: string | null
  message: string
  is_internal: boolean
  created_at: string
}

export interface CartItem {
  product_name: string
  sku?: string
  pack_size?: string
  quantity: number
  notes?: string
}

export interface ExternalQuotePayload {
  api_key: string
  customer: {
    email: string
    full_name: string
    phone?: string
    company?: string
    license_number?: string
    address?: string
    city?: string
    state?: string
    zip?: string
  }
  cart_items: CartItem[]
  source?: QuoteSource
}
