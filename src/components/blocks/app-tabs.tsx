import { useState, type ReactNode } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface Tab {
  value: string
  label: string
  content: ReactNode
}

interface AppTabsProps {
  tabs: Tab[]
  defaultTab?: string
}

export function AppTabs({ tabs, defaultTab }: AppTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab ?? tabs[0]?.value ?? '')

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList>
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  )
}
