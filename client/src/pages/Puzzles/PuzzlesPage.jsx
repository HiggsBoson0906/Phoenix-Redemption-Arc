import React, { useState, useMemo } from 'react';
import {
  Puzzle,
  Search,
  X,
  CheckCircle2,
  ExternalLink,
  HelpCircle,
  BrainCircuit,
  Filter
} from 'lucide-react';
import { getPuzzleCategories, getAllPuzzles } from '@/utils/puzzleAdapter';
import { useProgress } from '@/context/ProgressContext';
import Navbar from '@/components/common/Navbar.jsx';
import Footer from '@/components/common/Footer.jsx';

export default function PuzzlesPage() {
  const { checkedState, toggleProblem } = useProgress();

  const categories = useMemo(() => getPuzzleCategories(), []);
  const allPuzzles = useMemo(() => getAllPuzzles(), []);

  const [activeCategory, setActiveCategory] = useState('ALL');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // ALL, SOLVED, UNSOLVED

  const filteredPuzzles = useMemo(() => {
    const q = search.trim().toLowerCase();
    return allPuzzles.filter((item) => {
      const matchesCat = activeCategory === 'ALL' || item.category === activeCategory;
      const isSolved = !!checkedState[item.id];
      const matchesStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'SOLVED' && isSolved) ||
        (statusFilter === 'UNSOLVED' && !isSolved);
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.slug.toLowerCase().includes(q);

      return matchesCat && matchesStatus && matchesSearch;
    });
  }, [allPuzzles, activeCategory, statusFilter, search, checkedState]);

  const totalCount = allPuzzles.length;
  const doneCount = allPuzzles.filter((p) => !!checkedState[p.id]).length;
  const pctDone = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  return (
    <div className="sheet-page">
      <Navbar />
      <div className="sheet-layout" style={{ maxWidth: '1150px', margin: '0 auto', padding: '24px 16px' }}>
        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
            <div style={{
              fontSize: '2rem',
              width: '56px',
              height: '56px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(236, 72, 153, 0.15)',
              borderRadius: '16px',
              border: '1px solid rgba(236, 72, 153, 0.3)',
              color: '#f472b6'
            }}>
              <BrainCircuit size={28} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.85rem', fontWeight: '800', color: '#f3f4f6', margin: 0 }}>
                Interview Puzzles & Lateral Thinking
              </h1>
              <p style={{ color: '#9ca3af', fontSize: '0.95rem', margin: '4px 0 0' }}>
                90 classic logical, mathematical, arrangement, and analytical brain-teasers frequently asked in technical interviews.
              </p>
            </div>
          </div>

          {/* Progress Tracker */}
          <div style={{
            marginTop: '18px',
            padding: '16px 20px',
            background: 'rgba(20, 23, 34, 0.7)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.07)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <CheckCircle2 size={22} color="#10b981" />
              <div>
                <div style={{ color: '#f3f4f6', fontWeight: '700', fontSize: '1.05rem' }}>
                  {doneCount} / {totalCount} Puzzles Solved
                </div>
                <div style={{ color: '#9ca3af', fontSize: '0.85rem' }}>
                  {pctDone}% analytical mastery completed
                </div>
              </div>
            </div>

            <div style={{ flex: '1', minWidth: '180px', maxWidth: '300px' }}>
              <div style={{ height: '8px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '999px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${pctDone}%`,
                    background: 'linear-gradient(90deg, #ec4899, #8b5cf6)',
                    borderRadius: '999px',
                    transition: 'width 0.4s ease'
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Controls: Search, Status Filter, Category Filter */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
            <div className="search-wrap" style={{ flex: '1', minWidth: '240px' }}>
              <Search className="search-icon" size={16} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search 90 puzzles (e.g. horses, coins, prisoners, candles)..."
              />
              {search && (
                <X className="clear-icon" size={16} onClick={() => setSearch('')} title="Clear search" />
              )}
            </div>

            <div className="diff-filter">
              {['ALL', 'UNSOLVED', 'SOLVED'].map((filterKey) => {
                const isActive = statusFilter === filterKey;
                return (
                  <button
                    key={filterKey}
                    className={`chip ${isActive ? 'active' : ''}`}
                    onClick={() => setStatusFilter(filterKey)}
                  >
                    {filterKey}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '8px',
            scrollbarWidth: 'thin'
          }}>
            <button
              onClick={() => setActiveCategory('ALL')}
              className={`chip ${activeCategory === 'ALL' ? 'active' : ''}`}
              style={{ whiteSpace: 'nowrap', borderRadius: '999px', padding: '6px 14px' }}
            >
              All Puzzles ({totalCount})
            </button>
            {categories.map((cat) => {
              const isActive = activeCategory === cat.name;
              return (
                <button
                  key={cat.name}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`chip ${isActive ? 'active' : ''}`}
                  style={{ whiteSpace: 'nowrap', borderRadius: '999px', padding: '6px 14px' }}
                >
                  {cat.name} ({cat.count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Puzzles Grid */}
        {filteredPuzzles.length === 0 ? (
          <div className="empty-msg">
            No puzzles found matching your filters.
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '14px'
          }}>
            {filteredPuzzles.map((puzzle, idx) => {
              const isChecked = !!checkedState[puzzle.id];

              return (
                <div
                  key={puzzle.id}
                  style={{
                    background: '#141722',
                    borderRadius: '12px',
                    border: `1px solid ${isChecked ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255, 255, 255, 0.08)'}`,
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '12px',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{
                        fontSize: '0.72rem',
                        fontWeight: '700',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        background: 'rgba(236, 72, 153, 0.12)',
                        color: '#f472b6',
                        border: '1px solid rgba(236, 72, 153, 0.2)'
                      }}>
                        {puzzle.category}
                      </span>

                      <span style={{
                        fontSize: '0.75rem',
                        color: '#6b7280',
                        fontWeight: '600'
                      }}>
                        #{String(idx + 1).padStart(2, '0')}
                      </span>
                    </div>

                    <h4 style={{
                      margin: '4px 0 0',
                      fontSize: '0.98rem',
                      fontWeight: '600',
                      color: isChecked ? '#9ca3af' : '#f3f4f6',
                      textDecoration: isChecked ? 'line-through' : 'none',
                      lineHeight: '1.4'
                    }}>
                      {puzzle.title}
                    </h4>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '10px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.05)'
                  }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', userSelect: 'none' }}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          toggleProblem(puzzle.id, {
                            sheet: 'puzzles',
                            category: puzzle.category,
                            difficulty: 'M',
                          });
                        }}
                        style={{
                          width: '16px',
                          height: '16px',
                          accentColor: '#10b981',
                          cursor: 'pointer'
                        }}
                      />
                      <span style={{ fontSize: '0.82rem', color: isChecked ? '#34d399' : '#9ca3af', fontWeight: '500' }}>
                        {isChecked ? 'Solved ✓' : 'Mark Solved'}
                      </span>
                    </label>

                    <a
                      href={puzzle.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        fontSize: '0.8rem',
                        color: '#60a5fa',
                        textDecoration: 'none',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        background: 'rgba(96, 165, 250, 0.08)',
                        transition: 'background 0.2s ease',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(96, 165, 250, 0.16)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(96, 165, 250, 0.08)'}
                    >
                      Read Puzzle <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
