import { PORTUGUESE_HOLIDAYS_2024, NORMAL_WORK_HOURS } from '../constants';
import type { TimeEntry, TimeEntryData, CalculatedHours, ChartData } from '../types';

// Helper to parse date and time strings into a Date object
const parseDateTime = (date: string, time: string): Date => {
  return new Date(`${date}T${time}`);
};

export const calculateHours = (entry: TimeEntryData): CalculatedHours => {
  if (!entry.date || !entry.startTime || !entry.endTime) {
    return { normal: 0, overtime: 0, total: 0 };
  }

  const startDateTime = parseDateTime(entry.date, entry.startTime);
  const endDateTime = parseDateTime(entry.date, entry.endTime);

  if (endDateTime <= startDateTime) {
    return { normal: 0, overtime: 0, total: 0 };
  }

  const diffMs = endDateTime.getTime() - startDateTime.getTime();
  const totalWorkedHours = diffMs / (1000 * 60 * 60);
  
  if (totalWorkedHours < 0) return { normal: 0, overtime: 0, total: 0 };

  const dayOfWeek = new Date(entry.date).getUTCDay(); // 0 = Sunday, 6 = Saturday
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  const isHoliday = PORTUGUESE_HOLIDAYS_2024.includes(entry.date);

  let initialNormal = 0;
  let initialOvertime = 0;

  if (isWeekend || isHoliday) {
    initialOvertime = totalWorkedHours;
  } else {
    initialNormal = Math.min(totalWorkedHours, NORMAL_WORK_HOURS);
    initialOvertime = Math.max(0, totalWorkedHours - NORMAL_WORK_HOURS);
  }

  const totalDeductions = 
    ((entry.deductLunch ?? true) ? 1 : 0) + 
    ((entry.deductDinner ?? false) ? 1 : 0) + 
    (entry.customDeductionHours || 0);

  // Deduct from overtime first, then from normal hours.
  const overtimeAfterDeduction = Math.max(0, initialOvertime - totalDeductions);
  const remainingDeductions = Math.max(0, totalDeductions - initialOvertime);
  const normalAfterDeduction = Math.max(0, initialNormal - remainingDeductions);
  
  const finalNormal = Math.floor(normalAfterDeduction);
  const finalOvertime = Math.floor(overtimeAfterDeduction);

  return {
    normal: finalNormal,
    overtime: finalOvertime,
    total: finalNormal + finalOvertime,
  };
};


export const formatHours = (hours: number): string => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

const getWeekNumber = (d: Date): number => {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    return weekNo;
}


export const aggregateDataForCharts = (entries: TimeEntry[]): { weekly: ChartData[], monthly: ChartData[] } => {
    const weeklyData: { [key: string]: { normal: number, overtime: number } } = {};
    const monthlyData: { [key: string]: { normal: number, overtime: number } } = {};

    entries.forEach(entry => {
        const hours = calculateHours(entry);
        const date = new Date(entry.date);
        
        // Aggregate weekly
        const year = date.getUTCFullYear();
        const week = getWeekNumber(date);
        const weekKey = `${year}-W${week.toString().padStart(2, '0')}`;

        if (!weeklyData[weekKey]) {
            weeklyData[weekKey] = { normal: 0, overtime: 0 };
        }
        weeklyData[weekKey].normal += hours.normal;
        weeklyData[weekKey].overtime += hours.overtime;

        // Aggregate monthly
        const monthKey = `${year}-${(date.getUTCMonth() + 1).toString().padStart(2, '0')}`; // YYYY-MM
        if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = { normal: 0, overtime: 0 };
        }
        monthlyData[monthKey].normal += hours.normal;
        monthlyData[monthKey].overtime += hours.overtime;
    });

    const formatChartData = (data: { [key: string]: { normal: number, overtime: number } }): ChartData[] => {
        return Object.keys(data).sort().map(key => ({
            name: key,
            horasNormais: data[key].normal,
            horasExtras: data[key].overtime,
        }));
    }

    return {
        weekly: formatChartData(weeklyData),
        monthly: formatChartData(monthlyData),
    };
};
