'use server';

import { getBookRecommendations } from '@/ai/flows/book-recommendations';

export async function getRecommendationsAction(readingHistory: string) {
  try {
    const result = await getBookRecommendations({ readingHistory });
    
    // The AI returns a formatted string. We parse it to extract book titles.
    const recommendationsText = result.recommendations || '';

    // Handles formats like "1. The Great Gatsby by F. Scott Fitzgerald"
    const titles = recommendationsText
      .split('\n')
      .map(line => {
        // Remove numbering and "by Author" part to isolate the title
        const match = line.match(/^(?:\d+\.\s*)?(.+?)(?:\s+by\s+.*)?$/i);
        return match ? match[1].trim() : null;
      })
      .filter((title): title is string => title !== null && title !== '');

    if (titles.length === 0 && recommendationsText.length > 0) {
        // Fallback for simple comma separated list
        const commaTitles = recommendationsText.split(',').map(t => t.trim()).filter(Boolean);
        return { success: true, titles: commaTitles }
    }

    return { success: true, titles };
  } catch (error) {
    console.error('Error getting recommendations:', error);
    return { success: false, error: 'Failed to get recommendations from the AI model.' };
  }
}
