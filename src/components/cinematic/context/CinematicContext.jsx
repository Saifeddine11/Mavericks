import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const CinematicContext = createContext(null);

export function CinematicProvider({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activePopup, setActivePopup] = useState(null);
  const [activeSection, setActiveSection] = useState(-1);
  const [headerTheme, setHeaderTheme] = useState('light');

  const openMenu = useCallback(() => setMenuOpen(true), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const toggleMenu = useCallback(() => setMenuOpen((v) => !v), []);

  const openPopup = useCallback((id) => {
    setActivePopup(id);
    setMenuOpen(false);
  }, []);

  const closePopup = useCallback(() => setActivePopup(null), []);

  const value = useMemo(
    () => ({
      menuOpen,
      openMenu,
      closeMenu,
      toggleMenu,
      activePopup,
      openPopup,
      closePopup,
      activeSection,
      setActiveSection,
      headerTheme,
      setHeaderTheme,
    }),
    [
      menuOpen,
      openMenu,
      closeMenu,
      toggleMenu,
      activePopup,
      openPopup,
      closePopup,
      activeSection,
      headerTheme,
    ],
  );

  return <CinematicContext.Provider value={value}>{children}</CinematicContext.Provider>;
}

export function useCinematic() {
  const ctx = useContext(CinematicContext);
  if (!ctx) throw new Error('useCinematic must be used within CinematicProvider');
  return ctx;
}
