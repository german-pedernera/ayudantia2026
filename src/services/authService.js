import { signInAnonymously, signOut } from 'firebase/auth';
import { auth } from './firebase';

const VALID_USERS = [
  { username: 'Ger25$', password: 'Emi25$' },
  { username: 'Noe2026$', password: 'Noe2026$' },
];

const SESSION_KEY = 'aniversarios_user';

export const loginUser = async (username, password) => {
  const found = VALID_USERS.find(
    (u) => u.username === username && u.password === password
  );

  if (!found) {
    throw new Error('Usuario o contraseña incorrectos');
  }

  await signInAnonymously(auth);
  localStorage.setItem(SESSION_KEY, JSON.stringify({ username: found.username }));
  return { username: found.username };
};

export const logoutUser = async () => {
  await signOut(auth);
  localStorage.removeItem(SESSION_KEY);
};

export const getStoredUser = () => {
  try {
    const data = localStorage.getItem(SESSION_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};
