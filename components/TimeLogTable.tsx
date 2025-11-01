import React from 'react';
import type { TimeEntry } from '../types';
import { calculateHours, formatHours } from '../utils/time';
import { NORMAL_WORK_HOURS, PORTUGUESE_HOLIDAYS_2024 } from '../constants';


interface TimeLogTableProps {
  entries: TimeEntry[];
  onEdit: (entry: TimeEntry) => void;
  onDelete: (id: string) => void;
}

const TimeLogTable: React.FC<TimeLogTableProps> = ({ entries, onEdit, onDelete }) => {
  if (entries.length === 0) {
    return (
      <div className="text-center py-10 px-6 bg-slate-50 rounded-lg">
        <svg className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-slate-900">Nenhum registo de horas</h3>
        <p className="mt-1 text-sm text-slate-500">Comece por adicionar um novo registo.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Data</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Entrada</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Saída</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Horas Normais</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Horas Extra</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Total Horas</th>
            <th scope="col" className="relative px-6 py-3"><span className="sr-only">Ações</span></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-200">
          {entries.map((entry) => {
            const { normal, overtime, total } = calculateHours(entry);
            const formattedDate = new Date(entry.date).toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit', timeZone: 'UTC' });
            
            const dayOfWeek = new Date(entry.date).getUTCDay();
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
            const isHoliday = PORTUGUESE_HOLIDAYS_2024.includes(entry.date);
            const isDeficit = !isWeekend && !isHoliday && normal < NORMAL_WORK_HOURS;

            return (
              <tr key={entry.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{formattedDate}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{entry.startTime}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{entry.endTime}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  {isDeficit ? (
                    <span className="font-bold text-red-600">
                      {formatHours(normal)} (-{NORMAL_WORK_HOURS - normal}H)
                    </span>
                  ) : (
                    formatHours(normal)
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-cyan-600">{formatHours(overtime)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-semibold">{formatHours(total)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button onClick={() => onEdit(entry)} className="text-cyan-600 hover:text-cyan-900 transition p-1">
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2-2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
                    </button>
                    <button onClick={() => window.confirm('Tem a certeza que quer apagar este registo?') && onDelete(entry.id)} className="text-red-500 hover:text-red-800 transition p-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TimeLogTable;