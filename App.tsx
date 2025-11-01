
import React, { useState } from 'react';
import { useTimeEntries } from './hooks/useTimeEntries';
import type { TimeEntry, TimeEntryData } from './types';
import Header from './components/Header';
import TimeEntryForm from './components/TimeEntryForm';
import TimeLogTable from './components/TimeLogTable';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  const { entries, addEntry, updateEntry, deleteEntry } = useTimeEntries();
  const [editingEntry, setEditingEntry] = useState<TimeEntry | null>(null);

  const handleSaveEntry = (data: TimeEntryData) => {
    if (editingEntry) {
      updateEntry({ ...editingEntry, ...data });
      setEditingEntry(null);
    } else {
      addEntry(data);
    }
  };
  
  const handleEdit = (entry: TimeEntry) => {
    setEditingEntry(entry);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingEntry(null);
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-lg sticky top-8">
            <h2 className="text-2xl font-bold text-slate-700 mb-4">
              {editingEntry ? 'Editar Registo' : 'Novo Registo'}
            </h2>
            <TimeEntryForm 
              onSubmit={handleSaveEntry} 
              editingEntry={editingEntry}
              onCancelEdit={handleCancelEdit}
            />
          </div>
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold text-slate-700 mb-4">Registos de Horas</h2>
            <TimeLogTable entries={entries} onEdit={handleEdit} onDelete={deleteEntry} />
          </div>
        </div>
        <div className="mt-8">
          <Dashboard entries={entries} />
        </div>
      </main>
      <footer className="text-center p-4 text-slate-500 text-sm">
        <p>Desenvolvido com ♥ para a Lança Encanto</p>
      </footer>
    </div>
  );
};

export default App;
