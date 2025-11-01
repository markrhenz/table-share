/**
 * Table History Manager - Client-side storage only
 */
const HISTORY_KEY = 'table-share-history';
const MAX_HISTORY = 50;

/**
 * Add a table to history
 * @param {string} id - Table ID
 * @param {string} url - Full table URL
 * @param {string} previewText - First 50 chars of pasted data
 */
export function addToHistory(id, url, previewText) {
  try {
    const history = getHistory();

    // Add new entry at beginning
    history.unshift({
      id,
      url,
      created: new Date().toISOString(),
      preview: previewText.slice(0, 50).trim() + (previewText.length > 50 ? '...' : '')
    });

    // Keep only most recent MAX_HISTORY entries
    if (history.length > MAX_HISTORY) {
      history.length = MAX_HISTORY;
    }

    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    return true;
  } catch (error) {
    console.error('Failed to save history:', error);
    return false;
  }
}

/**
 * Get all history entries
 * @returns {Array} History array (newest first)
 */
export function getHistory() {
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load history:', error);
    return [];
  }
}

/**
 * Clear all history
 */
export function clearHistory() {
  try {
    localStorage.removeItem(HISTORY_KEY);
    return true;
  } catch (error) {
    console.error('Failed to clear history:', error);
    return false;
  }
}

/**
 * Export history as CSV
 * @returns {string} CSV formatted history
 */
export function exportHistoryCSV() {
  const history = getHistory();
  if (history.length === 0) return '';

  let csv = 'URL,Created,Preview\n';
  history.forEach(entry => {
    csv += `"${entry.url}","${entry.created}","${entry.preview.replace(/"/g, '""')}"\n`;
  });

  return csv;
}

/**
 * Get relative time string (e.g., "2 mins ago")
 * @param {string} isoDate - ISO date string
 * @returns {string} Relative time
 */
export function getRelativeTime(isoDate) {
  const now = new Date();
  const created = new Date(isoDate);
  const diffMs = now - created;
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'just now';
  if (diffMins === 1) return '1 min ago';
  if (diffMins < 60) return `${diffMins} mins ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours === 1) return '1 hour ago';
  if (diffHours < 24) return `${diffHours} hours ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 30) return `${diffDays} days ago`;

  return created.toLocaleDateString();
}