import { useMemo } from 'react';
import { useNetworkContactsStore } from '@/store/networkContactsStore';

export interface EventStat {
  name: string;
  count: number;
}

export interface IndustryStat {
  name: string;
  count: number;
}

export interface InterestStat {
  name: string;
  count: number;
}

export interface GrowthDataPoint {
  date: string;
  count: number;
  label: string;
}

export interface ActivityDataPoint {
  date: string;
  count: number;
}

export interface Insights {
  topEvent: EventStat | null;
  topIndustry: IndustryStat | null;
  avgContactsPerEvent: number;
  mostActiveDay: string;
  consistencyScore: number;
  networkingStreak: number;
}

export const useAnalyticsData = () => {
  const { contacts } = useNetworkContactsStore();

  const totalContacts = contacts.length;

  // Event statistics
  const eventStats = useMemo(() => {
    const events = new Map<string, number>();
    contacts.forEach(c => {
      if (c.event) {
        events.set(c.event, (events.get(c.event) || 0) + 1);
      }
    });
    return Array.from(events.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [contacts]);

  // Industry statistics
  const industryStats = useMemo(() => {
    const industries = new Map<string, number>();
    contacts.forEach(c => {
      if (c.industry) {
        industries.set(c.industry, (industries.get(c.industry) || 0) + 1);
      }
    });
    return Array.from(industries.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8); // Top 8 industries
  }, [contacts]);

  // Interest statistics
  const interestStats = useMemo(() => {
    const interests = new Map<string, number>();
    contacts.forEach(c => {
      c.interests.forEach(interest => {
        interests.set(interest, (interests.get(interest) || 0) + 1);
      });
    });
    return Array.from(interests.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [contacts]);

  // Growth data (cumulative over time)
  const growthData = useMemo(() => {
    if (contacts.length === 0) return [];

    const sorted = [...contacts].sort((a, b) => 
      new Date(a.taggedAt).getTime() - new Date(b.taggedAt).getTime()
    );

    const dataPoints: GrowthDataPoint[] = [];
    const now = new Date();
    const startDate = new Date(sorted[0].taggedAt);
    
    // Calculate time span
    const daysDiff = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff <= 30) {
      // Show daily for last 30 days
      let cumulative = 0;
      for (let i = 0; i <= daysDiff; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        
        const count = sorted.filter(c => {
          const cDate = new Date(c.taggedAt).toISOString().split('T')[0];
          return cDate === dateStr;
        }).length;
        
        cumulative += count;
        dataPoints.push({
          date: dateStr,
          count: cumulative,
          label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        });
      }
    } else {
      // Show weekly for longer periods
      const weeks = Math.ceil(daysDiff / 7);
      let cumulative = 0;
      
      for (let i = 0; i <= weeks; i++) {
        const weekStart = new Date(startDate);
        weekStart.setDate(weekStart.getDate() + (i * 7));
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        
        const count = sorted.filter(c => {
          const cDate = new Date(c.taggedAt);
          return cDate >= weekStart && cDate <= weekEnd;
        }).length;
        
        cumulative += count;
        dataPoints.push({
          date: weekStart.toISOString().split('T')[0],
          count: cumulative,
          label: `Week ${i + 1}`
        });
      }
    }
    
    return dataPoints;
  }, [contacts]);

  // Activity data (tags per day/week)
  const activityData = useMemo(() => {
    if (contacts.length === 0) return [];

    const activity = new Map<string, number>();
    contacts.forEach(c => {
      const date = new Date(c.taggedAt).toISOString().split('T')[0];
      activity.set(date, (activity.get(date) || 0) + 1);
    });

    return Array.from(activity.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [contacts]);

  // Recent contacts (last 10)
  const recentContacts = useMemo(() => {
    return [...contacts]
      .sort((a, b) => new Date(b.taggedAt).getTime() - new Date(a.taggedAt).getTime())
      .slice(0, 10);
  }, [contacts]);

  // Calculate insights
  const insights = useMemo((): Insights => {
    const topEvent = eventStats[0] || null;
    const topIndustry = industryStats[0] || null;
    const avgContactsPerEvent = eventStats.length > 0 ? totalContacts / eventStats.length : 0;

    // Calculate most active day of week
    const dayCount = new Map<string, number>();
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    contacts.forEach(c => {
      const day = new Date(c.taggedAt).getDay();
      const dayName = dayNames[day];
      dayCount.set(dayName, (dayCount.get(dayName) || 0) + 1);
    });

    const mostActiveDay = Array.from(dayCount.entries())
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

    // Calculate networking streak (consecutive days/weeks with activity)
    let streak = 0;
    if (activityData.length > 0) {
      const sortedActivity = [...activityData].sort((a, b) => b.date.localeCompare(a.date));
      let currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);

      for (const activity of sortedActivity) {
        const activityDate = new Date(activity.date);
        activityDate.setHours(0, 0, 0, 0);
        
        const diffDays = Math.floor((currentDate.getTime() - activityDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0 || diffDays === 1) {
          streak++;
          currentDate = activityDate;
        } else if (diffDays > 1) {
          break;
        }
      }
    }

    // Calculate consistency score (0-100)
    const consistencyScore = contacts.length > 0 
      ? Math.min(100, Math.round((activityData.length / Math.max(30, activityData.length)) * 100))
      : 0;

    return {
      topEvent,
      topIndustry,
      avgContactsPerEvent,
      mostActiveDay,
      consistencyScore,
      networkingStreak: streak
    };
  }, [contacts, eventStats, industryStats, totalContacts, activityData]);

  // This month stats
  const thisMonthCount = useMemo(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    return contacts.filter(c => new Date(c.taggedAt) >= startOfMonth).length;
  }, [contacts]);

  // Quick vs Full tag ratio
  const quickTagRatio = useMemo(() => {
    if (totalContacts === 0) return 0;
    return Math.round((contacts.filter(c => c.isQuickTag).length / totalContacts) * 100);
  }, [contacts, totalContacts]);

  return {
    totalContacts,
    eventStats,
    industryStats,
    interestStats,
    growthData,
    activityData,
    recentContacts,
    insights,
    thisMonthCount,
    quickTagRatio,
    uniqueEventsCount: eventStats.length,
    uniqueIndustriesCount: industryStats.length
  };
};
