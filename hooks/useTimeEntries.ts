import { useState, useEffect, useCallback } from 'react';
import type { TimeEntry, TimeEntryData } from '../types';

const STORAGE_KEY = 'timeEntries_lancaEncanto';

// Helper function to sort entries by date (most recent first)
const sortEntries = (entries: TimeEntry[]): TimeEntry[] => {
  return [...entries].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    if (dateB !== dateA) {
      return dateB - dateA;
    }
    // If dates are the same, sort by start time (most recent first)
    return b.startTime.localeCompare(a.startTime);
  });
};


export const useTimeEntries = () => {
  const [entries, setEntries] = useState<TimeEntry[]>(() => {
    try {
      const savedEntries = window.localStorage.getItem(STORAGE_KEY);
      const parsedEntries = savedEntries ? JSON.parse(savedEntries) : [];
      return sortEntries(parsedEntries);
    } catch (error) {
      console.error("Error reading from localStorage", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch (error) {
      console.error("Error writing to localStorage", error);
    }
  }, [entries]);

  const addEntry = useCallback((entryData: TimeEntryData) => {
    const newEntry: TimeEntry = { ...entryData, id: crypto.randomUUID() };
    setEntries(currentEntries => sortEntries([...currentEntries, newEntry]));
  }, []);

  const updateEntry = useCallback((updatedEntry: TimeEntry) => {
    setEntries(currentEntries => 
      sortEntries(
        currentEntries.map(entry => (entry.id === updatedEntry.id ? updatedEntry : entry))
      )
    );
  }, []);
  
  const deleteEntry = useCallback((id: string) => {
    setEntries(currentEntries => 
      sortEntries(currentEntries.filter(entry => entry.id !== id))
    );
  }, []);

  return { entries, addEntry, updateEntry, deleteEntry };
};