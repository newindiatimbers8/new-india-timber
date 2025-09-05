import { storage, appwriteConfig } from '@/lib/appwrite';
import { ID } from 'appwrite';

export interface FileUploadResult {
  $id: string;
  name: string;
  size: number;
  mimeType: string;
  url: string;
}

class StorageService {
  // Upload product image
  async uploadProductImage(file: File): Promise<FileUploadResult> {
    try {
      const fileId = ID.unique();
      const uploadedFile = await storage.createFile(
        appwriteConfig.bucketIds.productImages,
        fileId,
        file
      );

      // Get file preview URL
      const fileUrl = this.getFileUrl(uploadedFile.$id);

      return {
        $id: uploadedFile.$id,
        name: uploadedFile.name,
        size: uploadedFile.sizeOriginal,
        mimeType: file.type,
        url: fileUrl
      };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to upload image');
    }
  }

  // Upload user file
  async uploadUserFile(file: File): Promise<FileUploadResult> {
    try {
      const fileId = ID.unique();
      const uploadedFile = await storage.createFile(
        appwriteConfig.bucketIds.userFiles,
        fileId,
        file
      );

      const fileUrl = this.getUserFileUrl(uploadedFile.$id);

      return {
        $id: uploadedFile.$id,
        name: uploadedFile.name,
        size: uploadedFile.sizeOriginal,
        mimeType: file.type,
        url: fileUrl
      };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to upload file');
    }
  }

  // Get product image URL
  getFileUrl(fileId: string): string {
    return storage.getFileView(
      appwriteConfig.bucketIds.productImages,
      fileId
    ).toString();
  }

  // Get user file URL
  getUserFileUrl(fileId: string): string {
    return storage.getFileView(
      appwriteConfig.bucketIds.userFiles,
      fileId
    ).toString();
  }

  // Get file preview URL (for images)
  getFilePreview(fileId: string, width?: number, height?: number): string {
    return storage.getFilePreview(
      appwriteConfig.bucketIds.productImages,
      fileId,
      width,
      height
    ).toString();
  }

  // Delete file
  async deleteFile(fileId: string, bucket: 'productImages' | 'userFiles' = 'productImages'): Promise<void> {
    try {
      const bucketId = bucket === 'productImages'
        ? appwriteConfig.bucketIds.productImages
        : appwriteConfig.bucketIds.userFiles;

      await storage.deleteFile(bucketId, fileId);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to delete file');
    }
  }

  // Get file info
  async getFileInfo(fileId: string, bucket: 'productImages' | 'userFiles' = 'productImages') {
    try {
      const bucketId = bucket === 'productImages'
        ? appwriteConfig.bucketIds.productImages
        : appwriteConfig.bucketIds.userFiles;

      return await storage.getFile(bucketId, fileId);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to get file info');
    }
  }

  // Upload multiple files
  async uploadMultipleFiles(files: File[]): Promise<FileUploadResult[]> {
    const uploadPromises = files.map(file => this.uploadProductImage(file));
    return await Promise.all(uploadPromises);
  }

  // Validate file type
  validateImageFile(file: File): boolean {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    return allowedTypes.includes(file.type) && file.size <= maxSize;
  }

  // Compress image before upload (basic implementation)
  async compressImage(file: File, maxWidth: number = 1920, quality: number = 0.8): Promise<File> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;

        // Draw and compress
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            });
            resolve(compressedFile);
          } else {
            resolve(file);
          }
        }, file.type, quality);
      };

      img.src = URL.createObjectURL(file);
    });
  }
}

export const storageService = new StorageService();
export default storageService;
