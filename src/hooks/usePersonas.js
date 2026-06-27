import { useState, useEffect } from 'react';
import {
  subscribePersonas,
  addPersona as addPersonaService,
  updatePersona as updatePersonaService,
  deletePersona as deletePersonaService,
} from '../services/personasService';

export const usePersonas = () => {
  const [personas, setPersonas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribePersonas((data) => {
      setPersonas(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addPersona = async (data) => {
    try {
      setError(null);
      await addPersonaService(data);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updatePersona = async (id, data) => {
    try {
      setError(null);
      await updatePersonaService(id, data);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deletePersona = async (id) => {
    try {
      setError(null);
      await deletePersonaService(id);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    personas,
    loading,
    error,
    addPersona,
    updatePersona,
    deletePersona,
  };
};
