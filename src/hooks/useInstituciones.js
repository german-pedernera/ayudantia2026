import { useState, useEffect } from 'react';
import {
  subscribeInstituciones,
  addInstitucion as addInstitucionService,
  updateInstitucion as updateInstitucionService,
  deleteInstitucion as deleteInstitucionService,
} from '../services/institucionesService';

export const useInstituciones = () => {
  const [instituciones, setInstituciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeInstituciones((data) => {
      setInstituciones(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addInstitucion = async (data) => {
    try {
      setError(null);
      await addInstitucionService(data);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateInstitucion = async (id, data) => {
    try {
      setError(null);
      await updateInstitucionService(id, data);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteInstitucion = async (id) => {
    try {
      setError(null);
      await deleteInstitucionService(id);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    instituciones,
    loading,
    error,
    addInstitucion,
    updateInstitucion,
    deleteInstitucion,
  };
};
