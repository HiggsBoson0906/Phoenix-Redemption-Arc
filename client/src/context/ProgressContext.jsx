import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import useAuth from '../hooks/useAuth.js';
import * as progressService from '../services/progressService.js';

const ProgressContext = createContext(null);

const GUEST_STORAGE_KEY = 'phoenix_guest_progress';
const GUEST_STARRED_STORAGE_KEY = 'phoenix_starred_problems';

const getGuestProgress = () => {
  try {
    const raw = localStorage.getItem(GUEST_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.error('Failed to parse guest progress from localStorage:', e);
    return {};
  }
};

const saveGuestProgress = (data) => {
  try {
    localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save guest progress to localStorage:', e);
  }
};

const clearGuestProgress = () => {
  try {
    localStorage.removeItem(GUEST_STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear guest progress:', e);
  }
};

const getGuestStarred = () => {
  try {
    const raw = localStorage.getItem(GUEST_STARRED_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.error('Failed to parse guest starred from localStorage:', e);
    return {};
  }
};

const saveGuestStarred = (data) => {
  try {
    localStorage.setItem(GUEST_STARRED_STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save guest starred to localStorage:', e);
  }
};

const clearGuestStarred = () => {
  try {
    localStorage.removeItem(GUEST_STARRED_STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear guest starred:', e);
  }
};

export const ProgressProvider = ({ children }) => {
  const { isAuthenticated, loading: authLoading } = useAuth();

  // Map of problemId -> boolean (true if status === 'Solved')
  const [checkedState, setCheckedState] = useState(() => {
    const guest = getGuestProgress();
    const stateMap = {};
    Object.keys(guest).forEach((slug) => {
      if (guest[slug]?.status === 'Solved') {
        stateMap[slug] = true;
      }
    });
    return stateMap;
  });

  // Map of problemId -> boolean (true if bookmarked / starred)
  const [starredState, setStarredState] = useState(() => {
    return getGuestStarred();
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isSyncingRef = useRef(false);

  // ── Load & Sync Progress ──────────────────────────────────────────────────
  const loadProgress = useCallback(async () => {
    if (!isAuthenticated) {
      // User is a guest: load state strictly from localStorage
      const guest = getGuestProgress();
      const stateMap = {};
      Object.keys(guest).forEach((slug) => {
        if (guest[slug]?.status === 'Solved') {
          stateMap[slug] = true;
        }
      });
      setCheckedState(stateMap);
      setStarredState(getGuestStarred());
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Check if user has guest progress to migrate into their account
      const guest = getGuestProgress();
      const guestItems = Object.values(guest).filter((item) => item && item.status === 'Solved');

      if (guestItems.length > 0 && !isSyncingRef.current) {
        isSyncingRef.current = true;
        try {
          // Attempt high-speed batch sync
          await progressService.syncProgressBatch(guestItems);
          clearGuestProgress();
        } catch (syncErr) {
          console.warn('Batch sync fallback to individual update requests:', syncErr);
          try {
            await Promise.all(
              guestItems.map((item) =>
                progressService.updateProgress({
                  problemId: item.problemId,
                  sheet: item.sheet || 'dp',
                  category: item.category || '',
                  difficulty: item.difficulty || 'E',
                  status: 'Solved',
                })
              )
            );
            clearGuestProgress();
          } catch (individualErr) {
            console.error('Failed to migrate some guest progress:', individualErr);
          }
        } finally {
          isSyncingRef.current = false;
        }
      }

      // 2. Sync any guest starred problems into MongoDB upon login
      const guestStarred = getGuestStarred();
      const guestStarredSlugs = Object.keys(guestStarred).filter((slug) => guestStarred[slug]);
      if (guestStarredSlugs.length > 0) {
        try {
          await Promise.all(
            guestStarredSlugs.map((slug) =>
              progressService.updateProgress({
                problemId: slug,
                sheet: 'dp',
                status: guest[slug]?.status === 'Solved' ? 'Solved' : 'Not Started',
                bookmarked: true,
              })
            )
          );
          clearGuestStarred();
        } catch (starredErr) {
          console.warn('Failed to migrate some guest starred problems:', starredErr);
        }
      }

      // 3. Fetch authenticated user's complete progress from MongoDB
      const data = await progressService.fetchProgress();
      if (data.success && Array.isArray(data.progress)) {
        const stateMap = {};
        const starredMap = {};
        data.progress.forEach((item) => {
          if (item.status === 'Solved') {
            stateMap[item.problemId] = true;
          }
          if (item.bookmarked) {
            starredMap[item.problemId] = true;
          }
        });
        setCheckedState(stateMap);
        setStarredState(starredMap);
      }
    } catch (err) {
      console.error('Failed to fetch progress from MongoDB:', err);
      setError('Failed to sync progress with database.');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!authLoading) {
      loadProgress();
    }
  }, [authLoading, loadProgress]);

  // ── Toggle problem status (Guest LocalStorage or Cloud MongoDB) ───────────
  const toggleProblem = useCallback(
    async (slug, metadata = {}) => {
      const isCurrentlySolved = !!checkedState[slug];
      const nextSolvedState = !isCurrentlySolved;
      const nextStatus = nextSolvedState ? 'Solved' : 'Not Started';

      // 1. Optimistic UI update immediately
      setCheckedState((prev) => ({
        ...prev,
        [slug]: nextSolvedState,
      }));

      // 2. Persist to Cloud if logged in
      if (isAuthenticated) {
        try {
          await progressService.updateProgress({
            problemId: slug,
            sheet: metadata.sheet || 'dp',
            category: metadata.category || '',
            difficulty: metadata.difficulty || 'E',
            status: nextStatus,
            bookmarked: !!starredState[slug],
          });
        } catch (err) {
          console.error(`Failed to update problem ${slug} in MongoDB`, err);
          // Revert optimistic update on failure
          setCheckedState((prev) => ({
            ...prev,
            [slug]: isCurrentlySolved,
          }));
        }
      } else {
        // 3. Persist to Browser Local Storage if guest
        const guest = getGuestProgress();
        if (nextSolvedState) {
          guest[slug] = {
            problemId: slug,
            sheet: metadata.sheet || 'dp',
            category: metadata.category || '',
            difficulty: metadata.difficulty || 'E',
            status: 'Solved',
          };
        } else {
          delete guest[slug];
        }
        saveGuestProgress(guest);
      }
    },
    [checkedState, starredState, isAuthenticated]
  );

  // ── Toggle star / bookmark on problem (Guest or Cloud) ───────────────────
  const toggleStarProblem = useCallback(
    async (slug, metadata = {}) => {
      const isCurrentlyStarred = !!starredState[slug];
      const nextStarredState = !isCurrentlyStarred;

      // 1. Optimistic UI update immediately
      setStarredState((prev) => {
        const next = { ...prev };
        if (nextStarredState) {
          next[slug] = true;
        } else {
          delete next[slug];
        }
        return next;
      });

      // 2. Persist to Cloud if logged in
      if (isAuthenticated) {
        try {
          const isSolved = !!checkedState[slug];
          await progressService.updateProgress({
            problemId: slug,
            sheet: metadata.sheet || 'dp',
            category: metadata.category || '',
            difficulty: metadata.difficulty || 'E',
            status: isSolved ? 'Solved' : 'Not Started',
            bookmarked: nextStarredState,
          });
        } catch (err) {
          console.error(`Failed to update bookmark for ${slug} in MongoDB`, err);
          // Revert optimistic update on failure
          setStarredState((prev) => {
            const next = { ...prev };
            if (isCurrentlyStarred) {
              next[slug] = true;
            } else {
              delete next[slug];
            }
            return next;
          });
        }
      } else {
        // 3. Persist to Browser Local Storage if guest
        const guestStarred = getGuestStarred();
        if (nextStarredState) {
          guestStarred[slug] = true;
        } else {
          delete guestStarred[slug];
        }
        saveGuestStarred(guestStarred);
      }
    },
    [starredState, checkedState, isAuthenticated]
  );

  // ── Reset sheet progress (Guest or Cloud) ──────────────────────────────────
  const resetSheetProgress = useCallback(
    async (sheet, sheetCategorySlugs = []) => {
      // Optimistically clear matching slugs in local state
      setCheckedState((prev) => {
        const nextState = { ...prev };
        sheetCategorySlugs.forEach((slug) => {
          delete nextState[slug];
        });
        return nextState;
      });

      if (isAuthenticated) {
        try {
          await progressService.resetProgress(sheet);
        } catch (err) {
          console.error(`Failed to reset progress for sheet '${sheet}' in MongoDB`, err);
          loadProgress();
        }
      } else {
        // Clear matching slugs from guest local storage
        const guest = getGuestProgress();
        sheetCategorySlugs.forEach((slug) => {
          delete guest[slug];
        });
        saveGuestProgress(guest);
      }
    },
    [isAuthenticated, loadProgress]
  );

  const value = {
    checkedState,
    starredState,
    loading,
    error,
    toggleProblem,
    toggleStarProblem,
    resetSheetProgress,
    refetchProgress: loadProgress,
  };

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
};

export const useProgressContext = () => {
  const ctx = useContext(ProgressContext);
  if (!ctx) {
    throw new Error('useProgressContext must be used inside <ProgressProvider>');
  }
  return ctx;
};

export const useProgress = useProgressContext;

export default ProgressContext;
