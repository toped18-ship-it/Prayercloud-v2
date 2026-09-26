/**
 * Utility for compressing and optimizing user-uploaded avatar images
 * Resizes large camera photos to a lightweight, crisp base64 string (< 40KB)
 * preventing LocalStorage quota exceptions while preserving high quality.
 */
export async function compressAvatarImage(
  fileOrDataUrl: File | string,
  maxWidth = 320,
  maxHeight = 320,
  quality = 0.85
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    const handleLoad = () => {
      try {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        if (!width || !height) {
          resolve(typeof fileOrDataUrl === 'string' ? fileOrDataUrl : '');
          return;
        }

        // Calculate aspect ratio preserving dimensions
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(typeof fileOrDataUrl === 'string' ? fileOrDataUrl : '');
          return;
        }

        // Smooth resizing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Export as compact JPEG data url
        const compressed = canvas.toDataURL('image/jpeg', quality);
        resolve(compressed);
      } catch (err) {
        console.warn('Canvas export fallback:', err);
        resolve(typeof fileOrDataUrl === 'string' ? fileOrDataUrl : '');
      }
    };

    img.onload = handleLoad;

    img.onerror = () => {
      // If image element fails to decode, try reading as raw dataUrl fallback
      if (typeof fileOrDataUrl === 'string') {
        resolve(fileOrDataUrl);
      } else {
        const fallbackReader = new FileReader();
        fallbackReader.onload = () => resolve((fallbackReader.result as string) || '');
        fallbackReader.onerror = () => reject(new Error('Failed to process image file.'));
        fallbackReader.readAsDataURL(fileOrDataUrl);
      }
    };

    if (typeof fileOrDataUrl === 'string') {
      img.src = fileOrDataUrl;
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          img.src = result;
        } else {
          reject(new Error('Could not read image data.'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read image file.'));
      reader.readAsDataURL(fileOrDataUrl);
    }
  });
}
