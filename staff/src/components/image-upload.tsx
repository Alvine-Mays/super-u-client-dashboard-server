import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCloudinaryUpload } from '@/hooks/use-cloudinary-upload';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  maxFiles?: number;
  label?: string;
  required?: boolean;
  folder?: string;
}

export function ImageUpload({
  value = [],
  onChange,
  maxFiles = 10,
  label = 'Images',
  required = false,
  folder = 'products',
}: ImageUploadProps) {
  const { uploadMultiple, uploading, progress } = useCloudinaryUpload({ folder, maxFiles });
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setError(null);
      try {
        const uploaded = await uploadMultiple(acceptedFiles);
        const newUrls = uploaded.map(img => img.url);
        onChange([...value, ...newUrls].slice(0, maxFiles));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur lors de l'upload");
      }
    },
    [uploadMultiple, value, onChange, maxFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'], 'image/webp': ['.webp'] },
    maxSize: 10 * 1024 * 1024,
    disabled: uploading || value.length >= maxFiles,
  });

  const removeImage = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <span className="text-xs text-muted-foreground">({value.length}/{maxFiles})</span>
      </div>

      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {value.map((url, index) => (
            <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border">
              <img src={url} alt={`Image ${index + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {value.length < maxFiles && (
        <div
          {...getRootProps()}
          className={cn(
            'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
            isDragActive && 'border-primary bg-primary/5',
            uploading && 'opacity-50 cursor-not-allowed',
            error && 'border-red-500'
          )}
        >
          <input {...getInputProps()} />
          {uploading ? (
            <div className="space-y-2">
              <Upload className="h-10 w-10 mx-auto text-muted-foreground animate-pulse" />
              <p className="text-sm text-muted-foreground">Upload en cours... {Math.round(progress)}%</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <ImageIcon className="h-10 w-10 mx-auto text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {isDragActive ? 'Déposez les images ici' : 'Cliquez ou glissez-déposez des images'}
              </p>
              <p className="text-xs text-muted-foreground">JPG, PNG, WEBP - Max 10MB</p>
            </div>
          )}
        </div>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}
      {required && value.length === 0 && (
        <p className="text-sm text-red-500">Au moins une image est requise</p>
      )}
    </div>
  );
}
