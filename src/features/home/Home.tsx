import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Upload, X } from 'lucide-react'

interface ImageFile {
  file: File
  preview: string
}

function Home() {
  const [images, setImages] = useState<ImageFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return

    const imageFiles: ImageFile[] = []
    
    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const preview = URL.createObjectURL(file)
        imageFiles.push({ file, preview })
      }
    })

    setImages((prev) => [...prev, ...imageFiles])
  }

  const handleFolderSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(event.target.files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const removeImage = (index: number) => {
    setImages((prev) => {
      const newImages = [...prev]
      URL.revokeObjectURL(newImages[index].preview)
      newImages.splice(index, 1)
      return newImages
    })
  }

  const clearAll = () => {
    images.forEach((img) => URL.revokeObjectURL(img.preview))
    setImages([])
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="min-h-screen from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Image Gallery</h1>
          <p className="text-gray-600">Upload a folder with images to display them all</p>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <input
            ref={fileInputRef}
            type="file"
            {...({ webkitdirectory: '' } as React.InputHTMLAttributes<HTMLInputElement>)}
            multiple
            onChange={handleFolderSelect}
            className="hidden"
            id="folder-input"
            accept="image/*"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2"
            variant="default"
          >
            <Upload className="w-4 h-4" />
            Select Folder
          </Button>
          
          {images.length > 0 && (
            <Button
              onClick={clearAll}
              variant="outline"
              className="flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Clear All ({images.length})
            </Button>
          )}
        </div>

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 bg-white'
          }`}
        >
          <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600 mb-2">
            Drag and drop images here, or click "Select Folder" to browse
          </p>
          <p className="text-sm text-gray-500">
            Supports: JPG, PNG, GIF, WebP, and other image formats
          </p>
        </div>

        {images.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Uploaded Images ({images.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <div
                  key={`${image.file.name}-${index}`}
                  className="relative group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
                >
                  <div className="aspect-square relative">
                    <img
                      src={image.preview}
                      alt={image.file.name}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      aria-label="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {image.file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(image.file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {images.length === 0 && (
          <div className="mt-12 text-center text-gray-500">
            <p>No images uploaded yet. Select a folder to get started!</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home
