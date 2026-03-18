'use client'

import { useState, useRef, useEffect } from 'react'
import { QuoteMessage, Profile } from '@/types/database'
import { createClient } from '@/lib/supabase/client'
import { formatDateTime } from '@/lib/utils'
import { Send } from 'lucide-react'

interface Props {
  quoteId: string
  messages: QuoteMessage[]
  currentUser: Profile | null
}

export function MessageThread({ quoteId, messages: initialMessages, currentUser }: Props) {
  const [messages, setMessages] = useState<QuoteMessage[]>(initialMessages)
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel(`quote-messages-${quoteId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'quote_messages', filter: `quote_id=eq.${quoteId}` },
        (payload) => {
          setMessages(prev => [...prev, payload.new as QuoteMessage])
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [quoteId, supabase])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!newMessage.trim() || !currentUser) return
    setSending(true)
    await supabase.from('quote_messages').insert({
      quote_id: quoteId,
      sender_id: currentUser.id,
      sender_name: currentUser.full_name || currentUser.email,
      message: newMessage.trim(),
      is_internal: false,
    })
    setNewMessage('')
    setSending(false)
  }

  const isStaff = (role: string) => ['admin', 'sales_rep'].includes(role)

  return (
    <div className="flex flex-col">
      {/* Messages */}
      <div className="px-6 py-4 space-y-4 min-h-48 max-h-96 overflow-y-auto">
        {messages.length === 0 && (
          <p className="text-center text-gray-400 text-sm py-8">No messages yet. Start the conversation.</p>
        )}
        {messages.map(msg => {
          const fromCurrentUser = msg.sender_id === currentUser?.id
          const fromStaff = currentUser?.role ? isStaff(currentUser.role) : false
          const isRight = fromCurrentUser

          return (
            <div key={msg.id} className={`flex ${isRight ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-sm lg:max-w-md ${isRight ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  isRight
                    ? 'bg-[#1e3a5f] text-white rounded-br-sm'
                    : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                }`}>
                  {msg.message}
                </div>
                <span className="text-xs text-gray-400">
                  {msg.sender_name || 'Unknown'} · {formatDateTime(msg.created_at)}
                </span>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-6 py-4 border-t border-gray-100">
        <form onSubmit={sendMessage} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={sending || !newMessage.trim()}
            className="flex items-center gap-1.5 bg-[#1e3a5f] text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[#2d5487] transition-colors disabled:opacity-50"
          >
            <Send size={14} />
            Send
          </button>
        </form>
      </div>
    </div>
  )
}
