// src/types/sheet.ts
// Formalizes the shape DSA sheet data files already use (see src/data/dpSections.js)
// so new sheets are type-checked without changing any existing data file.
//
// A node is either a leaf (has `links`) or a branch (has `subsections`), and
// `subsections` is the same type recursively — so the same shape covers
// section -> subsection -> sub-subsection to whatever depth a sheet needs.
// Every existing flat data file (just `links`, no `subsections`) is already a
// valid SheetSection, so nothing had to change to adopt this.

export interface SheetSection {
  title: string;
  description?: string;
  links?: string[];
  subsections?: SheetSection[];
}

export interface SheetMeta {
  slug: string;
  title: string;
  description: string;
  icon: string;
  link: string;
}
