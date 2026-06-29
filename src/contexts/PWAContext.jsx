import { createContext, useContext, useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

const PWAContext = createContext({
  installable: false,
  isInstalled: false,
  installApp: () => Promise.resolve(false),
  needRefresh: false,
  updateSW: () => {},
});

export const usePWA = () => useContext(PWAContext);

export const PWAProvider = ({ children }) => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installable, setInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(
    window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone || false
  );

  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW registrado correctamente');
    },
    onRegisterError(error) {
      console.error('Error al registrar SW:', error);
    },
  });

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setInstallable(true);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setInstallable(false);
      setIsInstalled(true);
      console.log('PWA instalada con éxito');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleDisplayModeChange = (evt) => {
      setIsInstalled(evt.matches);
    };
    mediaQuery.addEventListener('change', handleDisplayModeChange);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      mediaQuery.removeEventListener('change', handleDisplayModeChange);
    };
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) {
      console.warn('El prompt de instalación no está disponible aún.');
      return false;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    setDeferredPrompt(null);
    setInstallable(false);
    
    return outcome === 'accepted';
  };

  const updateSW = () => {
    updateServiceWorker(true);
  };

  return (
    <PWAContext.Provider value={{ installable, isInstalled, installApp, needRefresh, updateSW }}>
      {children}
    </PWAContext.Provider>
  );
};
