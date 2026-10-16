// client/src/utils/puzzleAdapter.js
// Adapter to normalize all 90 interview puzzles into categories and structured problem items

import puzzleSections from '@/content/puzzles/puzzleSections';
import { extractSlugFromUrl, titleFromSlug } from './dsaAdapter';

export function getPuzzleCategories() {
  return puzzleSections.map((sec, secIdx) => {
    const rawLinks = sec.links || [];
    const puzzles = rawLinks.map((url, pIdx) => {
      const slug = extractSlugFromUrl(url);
      let title = titleFromSlug(slug);
      // Clean up common puzzle URL artifacts like "Puzzle 4 Pay An Employee..."
      title = title.replace(/^Puzzle\s+\d+\s+/i, '');
      const id = `puzzle-${slug}`;

      return {
        id,
        slug,
        title,
        url,
        category: sec.title,
        index: pIdx + 1,
      };
    });

    return {
      name: sec.title,
      description: sec.description || '',
      puzzles,
      count: puzzles.length,
    };
  });
}

export function getAllPuzzles() {
  const categories = getPuzzleCategories();
  return categories.flatMap(c => c.puzzles);
}

export default puzzleSections;
