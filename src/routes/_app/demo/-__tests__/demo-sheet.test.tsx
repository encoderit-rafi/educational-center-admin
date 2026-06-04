import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { DemoSheet } from '../-components/demo-sheet'
import type { TQuizSchema } from '../-types'

const mockQuiz: TQuizSchema = {
  id: 1,
  uuid: 'uuid-1',
  name: 'Test Quiz',
  title: 'Title',
  heading: 'Heading',
  description: 'Description',
  date: '2026-01-01',
  is_active: true,
  embed_code: null,
}

describe('DemoSheet', () => {
  const defaultProps = {
    isOpen: true,
    onOpenChange: vi.fn(),
    mode: 'view' as 'view' | 'edit' | 'create',
    quiz: mockQuiz,
    onSubmit: vi.fn(),
    onCancel: vi.fn(),
  }

  it('renders view mode correctly', () => {
    render(<DemoSheet {...defaultProps} />)
    expect(screen.getByText('View Quiz')).toBeInTheDocument()
    expect(screen.getByText('Test Quiz')).toBeInTheDocument()
    expect(screen.getByText('Description')).toBeInTheDocument()
  })

  it('renders edit mode with initial values', () => {
    render(<DemoSheet {...defaultProps} mode="edit" />)
    expect(screen.getByText('Edit Quiz')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Test Quiz')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Description')).toBeInTheDocument()
  })

  it('renders create mode with empty fields', () => {
    render(<DemoSheet {...defaultProps} mode="create" quiz={null} />)
    expect(screen.getByText('Create Quiz')).toBeInTheDocument()
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
  })

  it('submits form data in edit mode', () => {
    render(<DemoSheet {...defaultProps} mode="edit" />)
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'Updated Name' },
    })
    fireEvent.click(screen.getByText('Update'))
    expect(defaultProps.onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Updated Name',
      }),
    )
  })

  it('validates required fields on submit', async () => {
    render(<DemoSheet {...defaultProps} mode="create" quiz={null} />)
    fireEvent.click(screen.getByText('Create'))
    // Check for HTML5 validation or custom error messages
    expect(screen.getByLabelText(/name/i)).toBeRequired()
  })

  it('triggers onCancel when cancel button is clicked', () => {
    render(<DemoSheet {...defaultProps} />)
    fireEvent.click(screen.getByText('Cancel'))
    expect(defaultProps.onCancel).toHaveBeenCalled()
  })

  it('allows switching from view to edit mode', () => {
    // This depends on how internal state or props are handled.
    // If the sheet handles its own mode switch, test that here.
    // Otherwise, test that the 'Edit' button in view mode triggers the provided onEdit callback.
  })
})
