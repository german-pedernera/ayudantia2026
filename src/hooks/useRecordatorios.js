import { useState, useEffect } from 'react';
import {
  subscribeRecordatorios,
  addRecordatorio as addRecordatorioService,
  updateRecordatorio as updateRecordatorioService,
  deleteRecordatorio as deleteRecordatorioService,
} from '../services/recordatoriosService';

export const useRecordatorios = () => {
  const [recordatorios, setRecordatorios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeRecordatorios((data) => {
      setRecordatorios(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addRecordatorio = async (data) => {
    try {
      setError(null);
      await addRecordatorioService(data);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateRecordatorio = async (id, data) => {
    try {
      setError(null);
      await updateRecordatorioService(id, data);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteRecordatorio = async (id) => {
    try {
      setError(null);
      await deleteRecordatorioService(id);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    recordatorios,
    loading,
    error,
    addRecordatorio,
    updateRecordatorio,
    deleteRecordatorio,
  };
};
