// client/src/utils/companyAdapter.js
// Adapter to normalize all 4 Company Preparation sheets into standard AlgoAtlas categories and problems

import { companySheets } from '@/content/company-wise/registry';
import deShawSections from '@/content/company-wise/deShaw';
import ripplingSections from '@/content/company-wise/rippling';
import titanSections from '@/content/company-wise/titan';
import tekionSections from '@/content/company-wise/tekion';
import { convertSectionsToAlgoAtlasCategories } from './dsaAdapter';

const COMPANY_SECTIONS_MAP = {
  'de-shaw': {
    slug: 'de-shaw',
    title: 'DE Shaw OA Problems',
    description: "DSA problems curated from DE Shaw's Online Assessment rounds.",
    icon: '🏦',
    sections: deShawSections,
  },
  'rippling': {
    slug: 'rippling',
    title: 'Rippling OA & Interview Problems',
    description: 'OA patterns, the story-chain DSA round, and the stateful-service/LLD family.',
    icon: '🧬',
    sections: ripplingSections,
  },
  'titan': {
    slug: 'titan',
    title: 'Titan (Directi–Nova) SDE-1 Problems',
    description: 'Binary search on answer, shortest paths, DSU/MST and greedy+heap.',
    icon: '🪐',
    sections: titanSections,
  },
  'tekion': {
    slug: 'tekion',
    title: 'Tekion SDE-1 Preparation Problems',
    description: 'Tree, array, stack, and design-heavy problems from the Tekion SDE-1 preparation guide.',
    icon: '🚗',
    sections: tekionSections,
  },
};

export function getCompanyMetaList() {
  return companySheets.map(s => {
    const data = COMPANY_SECTIONS_MAP[s.slug];
    const totalProblems = data ? data.sections.reduce((acc, sec) => acc + (sec.links?.length || 0), 0) : 0;
    return {
      ...s,
      totalProblems,
    };
  });
}

export function getCompanySheet(slug) {
  const normSlug = (slug || 'de-shaw').toLowerCase();
  const entry = COMPANY_SECTIONS_MAP[normSlug] || COMPANY_SECTIONS_MAP['de-shaw'];
  return {
    slug: entry.slug,
    title: entry.title,
    description: entry.description,
    icon: entry.icon,
    categories: convertSectionsToAlgoAtlasCategories(entry.sections),
  };
}

export default COMPANY_SECTIONS_MAP;
