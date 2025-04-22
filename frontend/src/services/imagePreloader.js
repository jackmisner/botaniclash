// A simple in-memory cache for preloaded images
const imageCache = new Map();

/**
 * Preloads an image and stores it in memory
 * @param {string} url - The URL of the image to preload
 * @returns {Promise} - Resolves with the image URL when loaded
 */
export const preloadImage = (url) => {
  // If URL is already in our cache, return it immediately
  if (imageCache.has(url)) {
    return Promise.resolve(url);
  }

  // If URL is invalid, resolve with null
  if (!url) {
    return Promise.resolve(null);
  }

  // Return a promise that resolves when the image is loaded
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      // Store in our cache
      imageCache.set(url, true);
      resolve(url);
    };

    img.onerror = () => {
      // Mark as failed in our cache
      imageCache.set(url, false);
      resolve(null); // Resolve with null to indicate failure
    };

    img.src = url;
  });
};

/**
 * Preloads multiple images
 * @param {Array} urls - Array of image URLs to preload
 * @param {Function} onProgress - Optional callback for progress updates
 * @returns {Promise} - Resolves when all images are loaded
 */
export const preloadImages = (urls, onProgress = null) => {
  if (!urls || urls.length === 0) {
    return Promise.resolve([]);
  }

  let loaded = 0;
  const total = urls.length;

  const promises = urls.map((url) =>
    preloadImage(url).then((result) => {
      loaded++;
      if (onProgress) {
        onProgress(loaded, total);
      }
      return result;
    }),
  );

  return Promise.all(promises);
};

/**
 * Preloads images for a list of plants
 * @param {Array} plants - Array of plant objects
 * @param {Function} onProgress - Optional callback for progress updates
 * @returns {Promise} - Resolves when all images are loaded
 */
export const preloadPlantImages = (plants, onProgress = null) => {
  if (!plants || plants.length === 0) {
    return Promise.resolve([]);
  }

  // Extract image URLs from plants
  const imageUrls = plants.map((plant) => plant.image_url).filter((url) => url); // Filter out undefined/null URLs

  return preloadImages(imageUrls, onProgress);
};

/**
 * Checks if an image URL is already in the cache
 * @param {string} url - The URL to check
 * @returns {boolean} - True if the image is in cache
 */
export const isImageCached = (url) => {
  return imageCache.has(url);
};

/**
 * Creates a URL for an image, using a fallback if needed
 * @param {string} url - The primary image URL
 * @param {string} fallbackUrl - The fallback image URL
 * @returns {string} - The appropriate URL to use
 */
export const getImageUrl = (url, fallbackUrl) => {
  if (!url) return fallbackUrl;

  // If the image is in our cache and failed to load
  if (imageCache.has(url) && imageCache.get(url) === false) {
    return fallbackUrl;
  }

  return url;
};
