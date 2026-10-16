// src/utils/sheetTree.ts
// Shared helpers for walking a (possibly nested) SheetSection tree. A node's
// storage-key path is its chain of indices from the root, e.g. section 2 ->
// subsection 0 -> sub-subsection 1 becomes "2.0.1". A top-level flat section
// (no subsections anywhere in the sheet) collapses to just its own index, so
// every existing flat sheet keeps the exact "<sectionIdx>-<problemIdx>" keys
// it already stored in localStorage — this is purely additive.

import type { SheetSection } from "@/types";

export const pathKey = (path: number[]): string => path.join(".");

export const problemKey = (path: number[], problemIdx: number): string =>
  `${pathKey(path)}-${problemIdx}`;

export function totalLinks(node: SheetSection): number {
  const own = node.links?.length ?? 0;
  const nested =
    node.subsections?.reduce((sum, child) => sum + totalLinks(child), 0) ?? 0;
  return own + nested;
}

export function solvedLinks(
  node: SheetSection,
  path: number[],
  checked: Record<string, boolean>
): number {
  const key = pathKey(path);
  const own = node.links?.filter((_, i) => checked[`${key}-${i}`]).length ?? 0;
  const nested =
    node.subsections?.reduce(
      (sum, child, i) => sum + solvedLinks(child, [...path, i], checked),
      0
    ) ?? 0;
  return own + nested;
}
