import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import useAuth from '../hooks/useAuth.js';
import * as progressService from '../services/progressService.js';

const ProgressContext = createContext(null);

const GUEST_STORAGE_KEY = 'phoenix_guest_progress';
const GUEST_STARRED_STORAGE_KEY = 'phoenix_starred_problems';
const GUEST_SOLVE_HISTORY_KEY = 'phoenix_solve_history';

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

const getGuestSolveHistory = () => {
  try {
    const raw = localStorage.getItem(GUEST_SOLVE_HISTORY_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.error('Failed to parse guest solve history from localStorage:', e);
    return {};
  }
};

const saveGuestSolveHistory = (data) => {
  try {
    localStorage.setItem(GUEST_SOLVE_HISTORY_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save guest solve history to localStorage:', e);
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

  // Map of YYYY-MM-DD -> count of solved problems
  const [solveHistory, setSolveHistory] = useState(() => {
    return getGuestSolveHistory();
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
      setSolveHistory(getGuestSolveHistory());
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
        const historyMap = {};
        data.progress.forEach((item) => {
          if (item.status === 'Solved') {
            stateMap[item.problemId] = true;
            if (item.lastSolved) {
              const d = new Date(item.lastSolved).toISOString().split('T')[0];
              historyMap[d] = (historyMap[d] || 0) + 1;
            }
          }
          if (item.bookmarked) {
            starredMap[item.problemId] = true;
          }
        });
        setCheckedState(stateMap);
        setStarredState(starredMap);
        setSolveHistory(historyMap);
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

      // Update solve history for heatmap
      const today = new Date().toISOString().split('T')[0];
      setSolveHistory((prev) => {
        const updated = { ...prev };
        if (nextSolvedState) {
          updated[today] = (updated[today] || 0) + 1;
        } else {
          if (updated[today] && updated[today] > 1) {
            updated[today] -= 1;
          } else {
            delete updated[today];
          }
        }
        if (!isAuthenticated) saveGuestSolveHistory(updated);
        return updated;
      });

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

  // ── One-Click Backup Export & Import ────────────────────────────────────
  const exportBackup = useCallback(() => {
    const backupData = {
      app: 'AlgoAtlas',
      version: 1,
      exportedAt: new Date().toISOString(),
      checkedState,
      starredState,
      solveHistory,
    };
    const jsonStr = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateStr = new Date().toISOString().split('T')[0];
    link.href = url;
    link.download = `algoatlas_backup_${dateStr}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [checkedState, starredState, solveHistory]);

  const importBackup = useCallback(async (fileContent) => {
    try {
      const data = typeof fileContent === 'string' ? JSON.parse(fileContent) : fileContent;
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid JSON format');
      }

      const newChecked = { ...checkedState, ...(data.checkedState || {}) };
      const newStarred = { ...starredState, ...(data.starredState || {}) };
      const newHistory = { ...solveHistory, ...(data.solveHistory || {}) };

      setCheckedState(newChecked);
      setStarredState(newStarred);
      setSolveHistory(newHistory);

      // Persist to local storage
      const guestProgress = getGuestProgress();
      Object.keys(newChecked).forEach((slug) => {
        if (newChecked[slug]) {
          guestProgress[slug] = guestProgress[slug] || { problemId: slug, status: 'Solved' };
        } else {
          delete guestProgress[slug];
        }
      });
      saveGuestProgress(guestProgress);
      saveGuestStarred(newStarred);
      saveGuestSolveHistory(newHistory);

      // If authenticated, sync with server
      if (isAuthenticated) {
        const itemsToSync = Object.keys(newChecked).map((slug) => ({
          problemId: slug,
          sheet: 'dp',
          status: newChecked[slug] ? 'Solved' : 'Not Started',
          bookmarked: !!newStarred[slug],
        }));
        if (itemsToSync.length > 0) {
          await progressService.syncProgressBatch(itemsToSync).catch(console.warn);
        }
      }

      return { success: true, count: Object.keys(newChecked).filter(k => newChecked[k]).length };
    } catch (err) {
      console.error('Failed to import backup:', err);
      return { success: false, error: err.message };
    }
  }, [checkedState, starredState, solveHistory, isAuthenticated]);

  const value = {
    checkedState,
    starredState,
    solveHistory,
    loading,
    error,
    toggleProblem,
    toggleStarProblem,
    resetSheetProgress,
    exportBackup,
    importBackup,
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
