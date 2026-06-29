import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';

const COLLECTION_NAME = 'recordatorios';

export const subscribeRecordatorios = (callback) => {
  const q = query(collection(db, COLLECTION_NAME), orderBy('fechaHora', 'asc'));
  return onSnapshot(q, (snapshot) => {
    const recordatorios = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        titulo: data.titulo || '',
        descripcion: data.descripcion || '',
        fechaHora: data.fechaHora || '',
        notificado: data.notificado ?? false,
        creadoEn: data.creadoEn || null,
      };
    });
    callback(recordatorios);
  });
};

export const addRecordatorio = async (data) => {
  return addDoc(collection(db, COLLECTION_NAME), {
    titulo: data.titulo.trim(),
    descripcion: data.descripcion ? data.descripcion.trim() : '',
    fechaHora: data.fechaHora,
    notificado: false,
    creadoEn: serverTimestamp(),
  });
};

export const updateRecordatorio = async (id, data) => {
  const docRef = doc(db, COLLECTION_NAME, id);
  return updateDoc(docRef, {
    titulo: data.titulo.trim(),
    descripcion: data.descripcion ? data.descripcion.trim() : '',
    fechaHora: data.fechaHora,
    notificado: data.notificado ?? false,
  });
};

export const deleteRecordatorio = async (id) => {
  const docRef = doc(db, COLLECTION_NAME, id);
  return deleteDoc(docRef);
};
