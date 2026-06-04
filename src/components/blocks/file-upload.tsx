import { useState, useRef } from 'react'
import { X, Loader2, ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import api from '@/lib/axios'

const API_ORIGIN = (() => {
  try {
    return new URL(api.defaults.baseURL ?? '').origin
  } catch {
    return ''
  }
})()

interface FileUploadProps {
  value?: string
  onChange?: (url: string) => void
  accept?: string
  maxSizeMB?: number
}

export function FileUpload({
  value,
  onChange,
  accept = 'image/*',
  maxSizeMB = 5,
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imgError, setImgError] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)
    setImgError(false)

    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size must be under ${maxSizeMB}MB`)
      return
    }

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await api.post('/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      const fileUrl: string = res.data.url
      const fullUrl = fileUrl.startsWith('http')
        ? fileUrl
        : `${API_ORIGIN}${fileUrl}`

      console.log(fullUrl)

      onChange?.(fullUrl)
    } catch {
      setError('Upload failed. Please try again.')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const handleRemove = () => {
    onChange?.('')
  }

  const displaySrc = value?.startsWith('http')
    ? value
    : `${API_ORIGIN}${value ?? ''}`

  return (
    <div className="space-y-2">
      {!value ? (
        <div
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-muted-foreground/25 rounded-md p-8 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-muted-foreground/50 transition-colors"
        >
          {uploading ? (
            <>
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Uploading...</span>
            </>
          ) : (
            <>
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Click to upload image
              </span>
              <span className="text-xs text-muted-foreground/60">
                PNG, JPG, GIF, WebP, SVG (max {maxSizeMB}MB)
              </span>
            </>
          )}
        </div>
      ) : (
        <div className="relative rounded-md overflow-hidden border border-muted group">
          <img
            src={displaySrc}
            alt="Thumbnail preview"
            className="w-full h-40 object-cover"
            onError={() => setImgError(true)}
          />
          {imgError && (
            <div className="absolute top-2 right-2">
              <span className="text-xs text-destructive bg-background/80 px-2 py-0.5 rounded">
                Failed to load
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => inputRef.current?.click()}
              >
                Change
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleRemove}
              >
                <X className="h-4 w-4 mr-1" />
                Remove
              </Button>
            </div>
          </div>
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleFileSelect}
        disabled={uploading}
      />
    </div>
  )
}
