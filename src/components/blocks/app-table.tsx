import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const items = [
  { balance: '$1,250.00', email: 'alex.t@company.com', id: '1', location: 'San Francisco, US', name: 'Alex Thompson', status: 'Active' },
  { balance: '$600.00', email: 'sarah.c@company.com', id: '2', location: 'Singapore', name: 'Sarah Chen', status: 'Active' },
  { balance: '$650.00', email: 'j.wilson@company.com', id: '3', location: 'London, UK', name: 'James Wilson', status: 'Inactive' },
  { balance: '$0.00', email: 'm.garcia@company.com', id: '4', location: 'Madrid, Spain', name: 'Maria Garcia', status: 'Active' },
  { balance: '-$1,000.00', email: 'd.kim@company.com', id: '5', location: 'Seoul, KR', name: 'David Kim', status: 'Active' },
]

const statusClass: Record<string, string> = {
  Active:
    'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
  Inactive:
    'bg-zinc-100 text-zinc-600 dark:bg-zinc-400/10 dark:text-zinc-400',
}

function balanceClass(value: string) {
  if (value.startsWith('-')) return 'text-destructive font-mono tabular-nums'
  if (value === '$0.00') return 'text-muted-foreground font-mono tabular-nums'
  return 'text-emerald-600 dark:text-emerald-400 font-mono tabular-nums'
}

export default function AppTable() {
  return (
    <div className="flex-1 flex flex-col min-h-0">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Balance</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell>{item.email}</TableCell>
              <TableCell>{item.location}</TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusClass[item.status] ?? statusClass.Inactive}`}
                >
                  {item.status}
                </span>
              </TableCell>
              <TableCell className={`text-right ${balanceClass(item.balance)}`}>
                {item.balance}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow className="hover:bg-transparent">
            <TableCell colSpan={4}>
              Total ({items.length} accounts)
            </TableCell>
            <TableCell className="text-right font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
              $2,500.00
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  )
}
