export interface TimeEntry {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  deductLunch: boolean;
  deductDinner: boolean;
  customDeductionHours: number;
}

export type TimeEntryData = Omit<TimeEntry, 'id'>;

export interface CalculatedHours {
    normal: number;
    overtime: number;
    total: number;
}

export interface ChartData {
    name: string;
    horasNormais: number;
    horasExtras: number;
}
