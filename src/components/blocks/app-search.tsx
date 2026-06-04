import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'
import { ArrowRight, Search } from 'lucide-react'

export const AppSearch = () => {
  return (
    <InputGroup>
      <InputGroupAddon align="inline-start">
        <Search />
      </InputGroupAddon>
      <InputGroupInput placeholder="Search..." />
      <InputGroupAddon align="inline-end">
        <InputGroupButton>
          <ArrowRight />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  )
}
