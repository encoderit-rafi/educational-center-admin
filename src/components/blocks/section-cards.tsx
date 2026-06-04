import { TrendingDown, TrendingUp } from 'lucide-react'

export function SectionCards() {
  const cards = [
    {
      title: 'Total Revenue',
      value: '$1,250.00',
      change: '+12.5%',
      trend: 'up',
      subtitle: 'Trending up this month',
      footer: 'Visitors for the last 6 months',
    },
    {
      title: 'New Customers',
      value: '1,234',
      change: '-20%',
      trend: 'down',
      subtitle: 'Down 20% this period',
      footer: 'Acquisition needs attention',
    },
    {
      title: 'Active Accounts',
      value: '45,678',
      change: '+12.5%',
      trend: 'up',
      subtitle: 'Strong user retention',
      footer: 'Engagement exceed targets',
    },
    {
      title: 'Growth Rate',
      value: '4.5%',
      change: '+4.5%',
      trend: 'up',
      subtitle: 'Steady performance increase',
      footer: 'Meets growth projections',
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-5 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {cards.map((card) => (
        <div key={card.title} className="stat-card group">
          <div className="stat-accent" />
          <div className="flex items-start justify-between mb-3">
            <p className="text-sm font-medium text-muted-foreground">
              {card.title}
            </p>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                card.trend === 'up'
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                  : 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400'
              }`}
            >
              {card.trend === 'up' ? (
                <TrendingUp className="size-3" />
              ) : (
                <TrendingDown className="size-3" />
              )}
              {card.change}
            </span>
          </div>
          <p className="text-3xl font-bold tracking-tight text-foreground mb-3">
            {card.value}
          </p>
          <div className="flex items-center gap-2 text-xs">
            <span className="font-medium text-foreground/80">
              {card.subtitle}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">{card.footer}</p>
        </div>
      ))}
    </div>
  )
}
