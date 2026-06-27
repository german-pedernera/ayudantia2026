import {
  doc,
  getDoc,
  setDoc,
} from 'firebase/firestore';
import { db } from './firebase';

const CONFIG_DOC = 'telegram';
const COLLECTION_NAME = 'configuracion';

export const getConfig = async () => {
  const docRef = doc(db, COLLECTION_NAME, CONFIG_DOC);
  const snapshot = await getDoc(docRef);
  if (snapshot.exists()) {
    return snapshot.data();
  }
  return { botToken: '', chatId: '' };
};

export const saveConfig = async (data) => {
  const docRef = doc(db, COLLECTION_NAME, CONFIG_DOC);
  return setDoc(docRef, {
    botToken: data.botToken.trim(),
    chatId: data.chatId.trim(),
  }, { merge: true });
};

export const sendTestMessage = async (botToken, chatId) => {
  const message = '✅ Mensaje de prueba desde el Sistema de Aniversarios.\n\nLa configuración de Telegram funciona correctamente.';
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML',
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.description || 'Error al enviar mensaje de prueba');
  }

  return response.json();
};
