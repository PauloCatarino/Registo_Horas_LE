import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { TimeEntry } from '../types';
import { aggregateDataForCharts, formatHours, calculateHours } from '../utils/time';
import { FINANCE_EMAIL } from '../constants';

interface DashboardProps {
  entries: TimeEntry[];
}

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const normalHours = payload.find(p => p.dataKey === 'horasNormais')?.value || 0;
    const extraHours = payload.find(p => p.dataKey === 'horasExtras')?.value || 0;
    const totalHours = normalHours + extraHours;

    return (
      <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-lg text-sm">
        <p className="font-bold mb-2 text-slate-700">{label}</p>
        <p className="text-blue-500">{`Horas Normais: ${formatHours(normalHours)}`}</p>
        <p className="text-cyan-600">{`Horas Extras: ${formatHours(extraHours)}`}</p>
        <hr className="my-1 border-slate-200" />
        <p className="font-semibold text-slate-800">{`Total: ${formatHours(totalHours)}`}</p>
      </div>
    );
  }
  return null;
};

const Dashboard: React.FC<DashboardProps> = ({ entries }) => {
  const [view, setView] = useState<'weekly' | 'monthly'>('monthly');

  const { weekly, monthly } = useMemo(() => aggregateDataForCharts(entries), [entries]);

  const dataToDisplay = view === 'weekly' ? weekly : monthly;

  const handleEmailReport = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    const entriesThisMonth = entries.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear;
    });

    if (entriesThisMonth.length === 0) {
        alert("Não há registos este mês para enviar.");
        return;
    }

    let totalOvertime = 0;
    let body = `Olá,\n\nSegue o relatório de horas extras para ${today.toLocaleString('pt-BR', { month: 'long' })} de ${currentYear}.\n\n`;
    body += "Detalhes:\n";

    entriesThisMonth.forEach(entry => {
        const { overtime } = calculateHours(entry);
        if (overtime > 0) {
            totalOvertime += overtime;
            const formattedDate = new Date(entry.date).toLocaleDateString('pt-BR');
            body += `- ${formattedDate}: ${formatHours(overtime)} de horas extras\n`;
        }
    });

    body += `\nTotal de Horas Extras: ${formatHours(totalOvertime)}\n\n`;
    body += "Obrigado(a).";

    const subject = `Relatório de Horas Extras - ${today.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}`;
    const mailtoLink = `mailto:${FINANCE_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    window.location.href = mailtoLink;
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-700 mb-2 sm:mb-0">Dashboard de Horas</h2>
        <div className="flex items-center space-x-2">
           <div className="flex rounded-md shadow-sm">
            <button onClick={() => setView('weekly')} className={`px-3 py-1 rounded-l-md text-sm font-medium transition ${view === 'weekly' ? 'bg-cyan-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50 border'}`}>Semanal</button>
            <button onClick={() => setView('monthly')} className={`px-3 py-1 rounded-r-md text-sm font-medium transition ${view === 'monthly' ? 'bg-cyan-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50 border border-l-0'}`}>Mensal</button>
          </div>
          <button onClick={handleEmailReport} className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white font-semibold rounded-md shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition">
            <svg xmlns="http://www.w.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>
            <span>Enviar Relatório</span>
          </button>
        </div>
      </div>
      
      {dataToDisplay.length > 0 ? (
        <div style={{ width: '100%', height: 400 }}>
            <ResponsiveContainer>
                <BarChart data={dataToDisplay} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={(value) => `${value}h`} tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{fontSize: "14px"}}/>
                <Bar dataKey="horasNormais" stackId="a" fill="#3b82f6" name="Horas Normais" />
                <Bar dataKey="horasExtras" stackId="a" fill="#06b6d4" name="Horas Extras" />
                </BarChart>
            </ResponsiveContainer>
        </div>
      ) : (
        <p className="text-center text-slate-500 py-10">Não há dados suficientes para exibir o gráfico.</p>
      )}
    </div>
  );
};

export default Dashboard;