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

const COLLECTION_NAME = 'personnel';

export const subscribePersonas = (callback) => {
  const q = query(collection(db, COLLECTION_NAME), orderBy('name', 'asc'));
  return onSnapshot(q, (snapshot) => {
    const personas = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        nombreCompleto: data.name || '',
        fechaNacimiento: data.birthDate || '',
        telefono: data.phone || '',
        jerarquia: data.hierarchy || '',
        unidad: data.unidad || '',
        // Mantener los datos originales por si se necesitan
        _originalData: data,
      };
    });
    callback(personas);
  });
};

export const checkDuplicatePersona = async (nombreCompleto, excludeId = null) => {
  const fullName = nombreCompleto.trim().toUpperCase();
  const q = query(
    collection(db, COLLECTION_NAME),
    where('name', '==', fullName)
  );
  const snapshot = await getDocs(q);
  if (snapshot.empty) return false;
  if (excludeId) {
    return snapshot.docs.some((doc) => doc.id !== excludeId);
  }
  return true;
};

export const addPersona = async (data) => {
  const isDuplicate = await checkDuplicatePersona(data.nombreCompleto);
  if (isDuplicate) {
    throw new Error('Ya existe una persona con el mismo nombre');
  }

  const fullName = data.nombreCompleto.trim().toUpperCase();

  return addDoc(collection(db, COLLECTION_NAME), {
    name: fullName,
    birthDate: data.fechaNacimiento,
    phone: data.telefono.trim(),
    hierarchy: data.jerarquia || "",
    unidad: data.unidad || "",
    mi: "",
    civilStatus: "",
    notificationTime: "08:00",
    lastNotifiedDate: "",
    fechaCreacion: serverTimestamp(),
  });
};

export const updatePersona = async (id, data) => {
  const isDuplicate = await checkDuplicatePersona(data.nombreCompleto, id);
  if (isDuplicate) {
    throw new Error('Ya existe otra persona con el mismo nombre');
  }

  const fullName = data.nombreCompleto.trim().toUpperCase();

  const docRef = doc(db, COLLECTION_NAME, id);
  return updateDoc(docRef, {
    name: fullName,
    birthDate: data.fechaNacimiento,
    phone: data.telefono.trim(),
    hierarchy: data.jerarquia || "",
    unidad: data.unidad || "",
  });
};

export const deletePersona = async (id) => {
  const docRef = doc(db, COLLECTION_NAME, id);
  return deleteDoc(docRef);
};
