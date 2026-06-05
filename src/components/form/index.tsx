import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { TiptapEditor } from '@/components/blocks/tiptap-editor'

interface FormFieldProps<TFieldValues extends FieldValues = FieldValues> {
  name: Path<TFieldValues>
  control: Control<TFieldValues>
  label: string
  placeholder?: string
  description?: string
}

export function FormInput<TFieldValues extends FieldValues>({
  name,
  control,
  label,
  placeholder,
}: FormFieldProps<TFieldValues>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className="space-y-2">
          <Label>{label}</Label>
          <Input {...field} placeholder={placeholder} />
          {fieldState.error && (
            <p className="text-sm text-destructive">{fieldState.error.message}</p>
          )}
        </div>
      )}
    />
  )
}

export function FormTextarea<TFieldValues extends FieldValues>({
  name,
  control,
  label,
  placeholder,
}: FormFieldProps<TFieldValues>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className="space-y-2">
          <Label>{label}</Label>
          <Textarea {...field} placeholder={placeholder} />
          {fieldState.error && (
            <p className="text-sm text-destructive">{fieldState.error.message}</p>
          )}
        </div>
      )}
    />
  )
}

export function FormTiptap<TFieldValues extends FieldValues>({
  name,
  control,
  label,
}: {
  name: Path<TFieldValues>
  control: Control<TFieldValues>
  label: string
}) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className="space-y-2">
          <Label>{label}</Label>
          <TiptapEditor value={field.value || ''} onChange={field.onChange} />
          {fieldState.error && (
            <p className="text-sm text-destructive">{fieldState.error.message}</p>
          )}
        </div>
      )}
    />
  )
}

export function FormImageUpload<TFieldValues extends FieldValues>({
  name,
  control,
  label,
  description,
}: FormFieldProps<TFieldValues>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className="space-y-2">
          <Label>{label}</Label>
          <Input type="file" onChange={(e) => field.onChange(e.target.files?.[0])} />
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
          {fieldState.error && (
            <p className="text-sm text-destructive">{fieldState.error.message}</p>
          )}
        </div>
      )}
    />
  )
}

export function FormColorPicker<TFieldValues extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  defaultColor,
}: {
  name: Path<TFieldValues>
  control: Control<TFieldValues>
  label: string
  placeholder?: string
  defaultColor?: string
}) {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultColor as any}
      render={({ field, fieldState }) => (
        <div className="space-y-2">
          <Label>{label}</Label>
          <div className="flex items-center gap-2">
            <Input type="color" {...field} className="w-12 h-9 p-1" />
            <Input {...field} placeholder={placeholder} />
          </div>
          {fieldState.error && (
            <p className="text-sm text-destructive">{fieldState.error.message}</p>
          )}
        </div>
      )}
    />
  )
}
