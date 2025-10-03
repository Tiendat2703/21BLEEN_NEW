// Define the order of pages that appear in the menu
const PAGE_ORDER = [
  '/home',
  '/images',
  '/video',
  '/messages',
  '/settings'
];

/**
 * Get the previous page path
 * @param {string} currentPath - Current page path
 * @returns {string|null} Previous page path or null if at first page
 */
export const getPreviousPage = (currentPath) => {
  const currentIndex = PAGE_ORDER.indexOf(currentPath);
  if (currentIndex > 0) {
    return PAGE_ORDER[currentIndex - 1];
  }
  return null;
};

/**
 * Get the next page path
 * @param {string} currentPath - Current page path
 * @returns {string|null} Next page path or null if at last page
 */
export const getNextPage = (currentPath) => {
  const currentIndex = PAGE_ORDER.indexOf(currentPath);
  if (currentIndex >= 0 && currentIndex < PAGE_ORDER.length - 1) {
    return PAGE_ORDER[currentIndex + 1];
  }
  return null;
};

