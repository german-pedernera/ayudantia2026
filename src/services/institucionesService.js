import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  onSnapshot,
  where,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';

const COLLECTION_NAME = 'instituciones';

export const subscribeInstituciones = (callback) => {
  const q = query(collection(db, COLLECTION_NAME), orderBy('nombreInstitucion', 'asc'));
  return onSnapshot(q, (snapshot) => {
    const instituciones = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(instituciones);
  });
};

export const checkDuplicateInstitucion = async (nombreInstitucion, excludeId = null) => {
  const q = query(
    collection(db, COLLECTION_NAME),
    where('nombreInstitucion', '==', nombreInstitucion.trim())
  );
  const snapshot = await getDocs(q);
  if (snapshot.empty) return false;
  if (excludeId) {
    return snapshot.docs.some((doc) => doc.id !== excludeId);
  }
  return true;
};

export const addInstitucion = async (data) => {
  const isDuplicate = await checkDuplicateInstitucion(data.nombreInstitucion);
  if (isDuplicate) {
    throw new Error('Ya existe una institución con el mismo nombre');
  }

  return addDoc(collection(db, COLLECTION_NAME), {
    nombreInstitucion: data.nombreInstitucion.trim(),
    fechaCreacionInstitucion: data.fechaCreacionInstitucion,
    direccion: data.direccion.trim(),
    responsable: data.responsable.trim(),
    telefono: data.telefono.trim(),
    observaciones: data.observaciones?.trim() || '',
    fechaCreacion: serverTimestamp(),
  });
};

export const updateInstitucion = async (id, data) => {
  const isDuplicate = await checkDuplicateInstitucion(data.nombreInstitucion, id);
  if (isDuplicate) {
    throw new Error('Ya existe otra institución con el mismo nombre');
  }

  const docRef = doc(db, COLLECTION_NAME, id);
  return updateDoc(docRef, {
    nombreInstitucion: data.nombreInstitucion.trim(),
    fechaCreacionInstitucion: data.fechaCreacionInstitucion,
    direccion: data.direccion.trim(),
    responsable: data.responsable.trim(),
    telefono: data.telefono.trim(),
    observaciones: data.observaciones?.trim() || '',
  });
};

export const deleteInstitucion = async (id) => {
  const docRef = doc(db, COLLECTION_NAME, id);
  return deleteDoc(docRef);
};
