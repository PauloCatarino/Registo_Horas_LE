import React, { useState, useEffect } from 'react';
import type { TimeEntry, TimeEntryData } from '../types';

interface TimeEntryFormProps {
  onSubmit: (data: TimeEntryData) => void;
  editingEntry: TimeEntry | null;
  onCancelEdit: () => void;
}

const TimeEntryForm: React.FC<TimeEntryFormProps> = ({ onSubmit, editingEntry, onCancelEdit }) => {
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('17:00');
  const [deductLunch, setDeductLunch] = useState(true);
  const [deductDinner, setDeductDinner] = useState(false);
  const [customDeductionHours, setCustomDeductionHours] = useState(0);


  useEffect(() => {
    if (editingEntry) {
      setDate(editingEntry.date);
      setStartTime(editingEntry.startTime);
      setEndTime(editingEntry.endTime);
      setDeductLunch(editingEntry.deductLunch ?? true);
      setDeductDinner(editingEntry.deductDinner ?? false);
      setCustomDeductionHours(editingEntry.customDeductionHours ?? 0);
    } else {
      // Set default date to today and reset form
      const today = new Date().toISOString().split('T')[0];
      setDate(today);
      setStartTime('08:00');
      setEndTime('17:00');
      setDeductLunch(true);
      setDeductDinner(false);
      setCustomDeductionHours(0);
    }
  }, [editingEntry]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (date && startTime && endTime) {
      onSubmit({ date, startTime, endTime, deductLunch, deductDinner, customDeductionHours: Number(customDeductionHours) });
      if (!editingEntry) {
        const today = new Date().toISOString().split('T')[0];
        setDate(today);
        setStartTime('08:00');
        setEndTime('17:00');
        setDeductLunch(true);
        setDeductDinner(false);
        setCustomDeductionHours(0);
      }
    } else {
      alert("Por favor, preencha todos os campos.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-slate-600 mb-1">Data</label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="startTime" className="block text-sm font-medium text-slate-600 mb-1">Entrada</label>
          <input
            type="time"
            id="startTime"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
          />
        </div>
        <div>
          <label htmlFor="endTime" className="block text-sm font-medium text-slate-600 mb-1">Saída</label>
          <input
            type="time"
            id="endTime"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
          />
        </div>
      </div>
       <div className="space-y-4 pt-4 border-t border-slate-200">
         <h3 className="text-md font-medium text-slate-600">Descontos</h3>
        <div className="flex items-center">
          <input
            id="deductLunch"
            name="deductLunch"
            type="checkbox"
            checked={deductLunch}
            onChange={(e) => setDeductLunch(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
          />
          <label htmlFor="deductLunch" className="ml-2 block text-sm text-slate-900">
            Descontar 1h de almoço
          </label>
        </div>
        <div className="flex items-center">
          <input
            id="deductDinner"
            name="deductDinner"
            type="checkbox"
            checked={deductDinner}
            onChange={(e) => setDeductDinner(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
          />
          <label htmlFor="deductDinner" className="ml-2 block text-sm text-slate-900">
            Descontar 1h de jantar
          </label>
        </div>
         <div>
          <label htmlFor="customDeduction" className="block text-sm font-medium text-slate-600 mb-1">Outros descontos (horas)</label>
          <input
            type="number"
            id="customDeduction"
            value={customDeductionHours}
            onChange={(e) => setCustomDeductionHours(Number(e.target.value))}
            min="0"
            step="1"
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
          />
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 pt-2">
        <button
          type="submit"
          className="w-full flex-grow justify-center px-4 py-2 bg-cyan-600 text-white font-semibold rounded-md shadow-sm hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition"
        >
          {editingEntry ? 'Guardar Alterações' : 'Adicionar Registo'}
        </button>
        {editingEntry && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="w-full sm:w-auto px-4 py-2 bg-slate-200 text-slate-700 font-semibold rounded-md hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 transition"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
};

export default TimeEntryForm;
