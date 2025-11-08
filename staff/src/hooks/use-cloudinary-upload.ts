import { useState } from 'react';
import { apiRequest } from '@/lib/queryClient';

interface UploadOptions {
  folder?: string;
  maxFiles?: number;
  maxSizeMB?: number;
  acceptedFormats?: string[];
}

interface UploadedImage {
  url: string;
  publicId: string;
  width: number;
  height: number;
}

export function useCloudinaryUpload(options: UploadOptions = {}) {
  const {
    folder = 'products',
    maxFiles = 10,
    maxSizeMB = 10,
    acceptedFormats = ['image/jpeg', 'image/png', 'image/webp'],
  } = options;

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const validateFile = (file: File): string | null => {
    if (!acceptedFormats.includes(file.type)) {
      return `Format non supporté. Utilisez ${acceptedFormats.map(f => f.split('/')[1].toUpperCase()).join(', ')}`;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      return `Fichier trop volumineux. Maximum ${maxSizeMB}MB`;
    }
    return null;
  };

  const uploadImage = async (file: File): Promise<UploadedImage> => {
    const error = validateFile(file);
    if (error) throw new Error(error);

    const signatureData = await apiRequest<any>('POST', '/api/upload/signature', { folder });

    const formData = new FormData();
    formData.append('file', file);
    formData.append('signature', signatureData.data.signature);
    formData.append('timestamp', signatureData.data.timestamp);
    formData.append('api_key', signatureData.data.apiKey);
    formData.append('folder', signatureData.data.folder);

    const uploadResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${signatureData.data.cloudName}/image/upload`,
      { method: 'POST', body: formData }
    );
    if (!uploadResponse.ok) throw new Error('Upload failed');

    const result = await uploadResponse.json();
    return { url: result.secure_url, publicId: result.public_id, width: result.width, height: result.height };
  };

  const uploadMultiple = async (files: File[]): Promise<UploadedImage[]> => {
    if (files.length > maxFiles) throw new Error(`Maximum ${maxFiles} images autorisées`);
    setUploading(true); setProgress(0);
    try {
      const results: UploadedImage[] = [];
      for (let i = 0; i < files.length; i++) {
        const result = await uploadImage(files[i]);
        results.push(result);
        setProgress(((i + 1) / files.length) * 100);
      }
      return results;
    } finally { setUploading(false); setProgress(0); }
  };

  return { uploadImage, uploadMultiple, uploading, progress, validateFile };
}
