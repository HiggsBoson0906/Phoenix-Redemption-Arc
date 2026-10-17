import React, { useMemo } from 'react';
import { Flame, Calendar, Trophy, ChevronDown, ChevronUp } from 'lucide-react';

export function ActivityHeatmap({ solveHistory = {}, isCollapsed = false, onToggleCollapse }) {
  // Generate the last 16 weeks (112 days) up to today
  const { days, stats, weeks } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dayList = [];
    const NUM_DAYS = 119; // 17 weeks * 7 days

    // Align to ending on today's week end (Saturday)
    const dayOfWeek = today.getDay(); // 0 is Sunday
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + (6 - dayOfWeek));

    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - NUM_DAYS + 1);

    let maxSolvesInADay = 0;
    let totalSolvesRecorded = 0;

    const curr = new Date(startDate);
    while (curr <= endDate) {
      const dateStr = curr.toISOString().split('T')[0];
      const count = solveHistory[dateStr] || 0;
      const isFuture = curr > today;

      if (!isFuture) {
        totalSolvesRecorded += count;
        if (count > maxSolvesInADay) maxSolvesInADay = count;
      }

      dayList.push({
        dateStr,
        dayOfWeek: curr.getDay(),
        count: isFuture ? 0 : count,
        isFuture,
        isToday: curr.getTime() === today.getTime(),
      });
      curr.setDate(curr.getDate() + 1);
    }

    // Chunk into 7-day weeks (columns)
    const weekColumns = [];
    for (let i = 0; i < dayList.length; i += 7) {
      weekColumns.push(dayList.slice(i, i + 7));
    }

    // Calculate streaks
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    const checkDate = new Date(today);
    const todayStr = today.toISOString().split('T')[0];
    const todaySolved = (solveHistory[todayStr] || 0) > 0;

    // Start checking from today or yesterday
    let streakDate = new Date(today);
    if (!todaySolved) {
      streakDate.setDate(today.getDate() - 1);
    }

    while (true) {
      const dStr = streakDate.toISOString().split('T')[0];
      if ((solveHistory[dStr] || 0) > 0) {
        currentStreak++;
        streakDate.setDate(streakDate.getDate() - 1);
      } else {
        break;
      }
    }

    // Longest streak
    const sortedDates = Object.keys(solveHistory).sort();
    sortedDates.forEach((dStr, idx) => {
      if (idx === 0) {
        tempStreak = 1;
      } else {
        const prev = new Date(sortedDates[idx - 1]);
        const thisD = new Date(dStr);
        const diffDays = Math.round((thisD - prev) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          tempStreak++;
        } else if (diffDays > 1) {
          tempStreak = 1;
        }
      }
      if (tempStreak > longestStreak) longestStreak = tempStreak;
    });

    return {
      days: dayList,
      weeks: weekColumns,
      stats: {
        currentStreak,
        longestStreak: Math.max(longestStreak, currentStreak),
        totalSolves: totalSolvesRecorded,
        maxSolvesInADay,
      },
    };
  }, [solveHistory]);

  const getColorClass = (count, isFuture) => {
    if (isFuture) return 'heatmap-future';
    if (count === 0) return 'heatmap-l0';
    if (count <= 2) return 'heatmap-l1';
    if (count <= 4) return 'heatmap-l2';
    if (count <= 7) return 'heatmap-l3';
    return 'heatmap-l4';
  };

  const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div className="activity-heatmap-card">
      <div className="heatmap-header" onClick={onToggleCollapse}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calendar size={16} className="heatmap-icon" />
          <span className="heatmap-title">Daily Practice Heatmap</span>
          <span className="heatmap-badge">
            <Flame size={12} color="#f59e0b" style={{ display: 'inline', marginRight: 2 }} />
            {stats.currentStreak} Day Streak
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="heatmap-quick-stats">
            <span><strong>{stats.totalSolves}</strong> solves in history</span>
            {stats.longestStreak > 0 && (
              <span className="stat-pill"><Trophy size={11} /> Best: {stats.longestStreak}d</span>
            )}
          </div>
          <button type="button" className="collapse-btn" aria-label="Toggle Heatmap">
            {isCollapsed ? <ChevronDown size={15} /> : <ChevronUp size={15} />}
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <div className="heatmap-body">
          <div className="heatmap-grid-wrap">
            {/* Day of week labels */}
            <div className="heatmap-day-labels">
              {dayLabels.map((lbl, idx) => (
                <span key={idx} className="heatmap-day-label">{idx % 2 === 1 ? lbl : ''}</span>
              ))}
            </div>

            {/* Weeks columns */}
            <div className="heatmap-grid">
              {weeks.map((week, wIdx) => (
                <div key={wIdx} className="heatmap-week-col">
                  {week.map((day) => (
                    <div
                      key={day.dateStr}
                      className={`heatmap-cell ${getColorClass(day.count, day.isFuture)} ${day.isToday ? 'is-today' : ''}`}
                      title={`${day.dateStr}: ${day.count} problem${day.count === 1 ? '' : 's'} solved`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="heatmap-footer">
            <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Recent 17 Weeks</span>
            <div className="heatmap-legend">
              <span style={{ fontSize: '11px', color: 'var(--text-faint)' }}>Less</span>
              <div className="heatmap-cell heatmap-l0" />
              <div className="heatmap-cell heatmap-l1" />
              <div className="heatmap-cell heatmap-l2" />
              <div className="heatmap-cell heatmap-l3" />
              <div className="heatmap-cell heatmap-l4" />
              <span style={{ fontSize: '11px', color: 'var(--text-faint)' }}>More</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ActivityHeatmap;
