import { useState, useEffect } from 'react'
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Underline as UnderlineIcon,
  Quote,
  Code,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface TiptapEditorProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

export function TiptapEditor({
  value,
  onChange,
  className,
}: TiptapEditorProps) {
  const [htmlMode, setHtmlMode] = useState(false)

  useEffect(() => {
    if (!value) {
      setHtmlMode(true)
    }
  }, [])

  const wrapText = (before: string, after: string) => {
    const textarea = document.querySelector('textarea[data-tiptap]') as HTMLTextAreaElement
    if (!textarea) return
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selected = value.substring(start, end)
    const newValue = value.substring(0, start) + before + selected + after + value.substring(end)
    onChange(newValue)
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + before.length, end + before.length)
    }, 0)
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-0.5 p-1 border rounded-md bg-muted/50">
        <Button type="button" variant="ghost" size="sm" onClick={() => wrapText('<strong>', '</strong>')} title="Bold">
          <Bold className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => wrapText('<em>', '</em>')} title="Italic">
          <Italic className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => wrapText('<u>', '</u>')} title="Underline">
          <UnderlineIcon className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => wrapText('<s>', '</s>')} title="Strikethrough">
          <Strikethrough className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-border mx-1" />
        <Button type="button" variant="ghost" size="sm" onClick={() => wrapText('<ul><li>', '</li></ul>')} title="Bullet List">
          <List className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => wrapText('<ol><li>', '</li></ol>')} title="Ordered List">
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => wrapText('<blockquote>', '</blockquote>')} title="Blockquote">
          <Quote className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => wrapText('<code>', '</code>')} title="Code">
          <Code className="h-4 w-4" />
        </Button>
        <div className="flex-1" />
        <Button
          type="button"
          variant={htmlMode ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setHtmlMode(!htmlMode)}
        >
          {htmlMode ? 'Preview' : 'HTML'}
        </Button>
      </div>
      {htmlMode ? (
        <Textarea
          data-tiptap
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className={cn('min-h-[250px] font-mono text-sm', className)}
          placeholder="Enter HTML content..."
        />
      ) : (
        <div
          className={cn(
            'prose prose-sm max-w-none min-h-[250px] p-3 border rounded-md overflow-y-auto',
            className
          )}
          dangerouslySetInnerHTML={{ __html: value || '' }}
        />
      )}
    </div>
  )
}
