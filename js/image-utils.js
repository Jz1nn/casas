// ====== Image Compression Utilities ======

/**
 * Compresses an image file using Canvas API.
 * Resizes to maxWidth and converts to JPEG with specified quality.
 * @param {File} file - Image file from file input
 * @param {number} maxWidth - Maximum width in pixels (default: 800)
 * @param {number} quality - JPEG quality 0-1 (default: 0.65)
 * @returns {Promise<string>} Base64 data URL (data:image/jpeg;base64,...)
 */
export function compressImage(file, maxWidth = 800, quality = 0.65) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // Resize proportionally
                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                const base64 = canvas.toDataURL('image/jpeg', quality);
                resolve(base64);
            };
            img.onerror = () => reject(new Error('Erro ao carregar imagem'));
            img.src = e.target.result;
        };
        reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
        reader.readAsDataURL(file);
    });
}

/**
 * Compresses multiple image files.
 * @param {FileList|File[]} files - Array of image files
 * @param {number} maxWidth
 * @param {number} quality
 * @returns {Promise<string[]>} Array of base64 data URLs
 */
export async function compressImages(files, maxWidth = 800, quality = 0.65) {
    const promises = Array.from(files).map(f => compressImage(f, maxWidth, quality));
    return Promise.all(promises);
}

/**
 * Validates that a string is a valid base64 image data URL.
 * @param {string} str
 * @returns {boolean}
 */
export function isBase64Image(str) {
    return typeof str === 'string' && str.startsWith('data:image/');
}

/**
 * Checks if a photo source is a URL (http/base64) or a local file path.
 * @param {string} src
 * @returns {'base64'|'url'|'local'}
 */
export function getPhotoType(src) {
    if (src.startsWith('data:image/')) return 'base64';
    if (src.startsWith('http://') || src.startsWith('https://')) return 'url';
    return 'local';
}
