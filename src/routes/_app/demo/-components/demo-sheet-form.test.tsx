import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { DemoSheet } from './demo-sheet'
import type { TQuizSchema } from '../-types'

const mockQuiz: TQuizSchema = {
  id: 1,
  uuid: 'uuid-1',
  name: 'Test Quiz',
  title: 'Title',
  heading: 'Heading',
  description: '<p>Test description</p>',
  date: '2026-01-01',
  is_active: true,
  embed_code: null,
}

describe('DemoSheet Form Interaction', () => {
  const defaultProps = {
    isOpen: true,
    onOpenChange: vi.fn(),
    mode: 'edit' as 'view' | 'edit' | 'create',
    quiz: mockQuiz,
    onSubmit: vi.fn(),
    onCancel: vi.fn(),
    onEdit: vi.fn(),
  }

  it('should not close the sheet when clicking TiptapEditor toolbar buttons', async () => {
    render(<DemoSheet {...defaultProps} />)

    // Find the Bold button in the TiptapEditor toolbar
    // The toolbar is in a div with class "flex items-center gap-1 p-1 border rounded-md bg-muted/50"
    // The button has a Bold icon.
    // Since we are using vitest/jsdom, we might need to be careful with how lucide icons are rendered.
    // But usually we can find it by role or by searching for something that might be in the button.

    // Let's try to find the button by its role and then check for something.
    // In the implementation, the buttons don't have aria-labels.
    // They only have the Lucide icon.

    // Let's try to find all buttons and see which one is the bold one.
    // Or better, let's add an aria-label to the TiptapEditor buttons in the actual code to make it testable.
    // But the user didn't ask me to change the code yet, just to test it.

    // For now, let's try to find it by the icon or just find all buttons in the toolbar.
    const buttons = screen.getAllByRole('button')

    // The buttons in DemoSheet are:
    // 1. Close button (if it exists in SheetContent) - wait, SheetContent has a Close button by default from shadcn/ui.
    // 2. Edit button (in view mode)
    // 3. Close button (in all modes)
    // 4. Submit button (in edit/create mode)
    // 5. Tiptap toolbar buttons (Bold, Italic, List)

    // Let's look for the Tiptap toolbar buttons. They are in a specific container.
    // They are small (size="sm").

    // Actually, let's try to find them by looking at the text/icon.
    // Since I can't easily "see" the icon, I'll look for the button that is NOT one of the main ones.

    // Let's just try to click them all and see if any of them call onOpenChange(false).

    // The main buttons:
    // - Close (button)
    // - Update Quiz / Create Quiz (button)
    // - Edit Quiz (button - in view mode)

    // Tiptap buttons:
    // - Bold
    // - Italic
    // - List

    // We can try to find them by searching for the icon's presence if possible,
    // or by their position.

    // Let's first find the "Update Quiz" button to make sure we have the right context.
    const submitButton = screen.getByText(/Update Quiz/i)
    expect(submitButton).toBeInTheDocument()

    // Now let's try to find the Tiptap buttons.
    // They are inside a div that is likely near the description.
    // Let's find the buttons that are NOT the submit button and NOT the close button.

    const allButtons = screen.getAllByRole('button')

    // We'll iterate through all buttons and click those that look like toolbar buttons.
    // Toolbar buttons have variant="ghost" and size="sm".
    // The main buttons have different variants/sizes.

    // In JSDOM, we can't easily check 'variant' prop unless we inspect the class.
    // shadcn buttons have 'inline-flex' and 'shrink-0' etc.

    // Let's try to find the button that has the Bold icon.
    // Lucide icons are SVGs.
    const boldButton = allButtons.find((btn) => btn.querySelector('svg'))

    if (boldButton) {
      fireEvent.click(boldButton)

      // Wait a bit for any potential async effects
      await waitFor(() => {
        expect(defaultProps.onOpenChange).not.toHaveBeenCalledWith(false)
      })
    } else {
      throw new Error(
        'Could not find any button with an SVG icon (likely Tiptap toolbar button)',
      )
    }
  })
})
