import { QuoteStatus } from '@/types/database'
import { STATUS_CONFIG } from '@/lib/utils'

interface Props {
  status: QuoteStatus
  className?: string
}

export function StatusBadge({ status, className = '' }: Props) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.closed
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config.className} ${className}`}>
      {status === 'new' && <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mr-1.5" />}
      {config.label}
    </span>
  )
}
