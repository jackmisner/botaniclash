/**
 * Pre-fetches images for a list of plants and stores them in browser cache
 * @param {Array} plants - Array of plant objects containing image_url property
 * @param {Function} onProgress - Optional callback for tracking loading progress
 * @returns {Promise} - Resolves when all images are cached
 */

export const prefetchPlantImages = (plants, onProgress = null) => {
  if (!plants || plants.length === 0) return Promise.resolve();

  let loadedCount = 0;
  const totalCount = plants.length;

  // Create a promise for each image
  const imagePromises = plants.map((plant) => {
    return new Promise((resolve) => {
      // Skip invalid URLs
      if (!plant.image_url) {
        loadedCount++;
        if (onProgress) onProgress(loadedCount, totalCount);
        resolve();
        return;
      }

      const img = new Image();

      img.onload = () => {
        loadedCount++;
        if (onProgress) onProgress(loadedCount, totalCount);
        resolve();
      };

      img.onerror = () => {
        loadedCount++;
        if (onProgress) onProgress(loadedCount, totalCount);
        resolve();
      };

      // Set src to start loading the image
      img.src = plant.image_url;
    });
  });

  // Return a promise that resolves when all images are loaded
  return Promise.all(imagePromises);
};
