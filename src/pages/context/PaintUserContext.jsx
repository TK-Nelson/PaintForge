// PaintUserContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const PaintUserContext = createContext();

const LOCAL_STORAGE_OWNED = 'paintforge_owned';
const LOCAL_STORAGE_FAVORITES = 'paintforge_favorites';

export const PaintUserProvider = ({ children }) => {
  // Load from localStorage on mount
  const [myPaints, setMyPaints] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_OWNED);
    return saved ? JSON.parse(saved) : [];
  });
  const [favoritePaints, setFavoritePaints] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_FAVORITES);
    return saved ? JSON.parse(saved) : [];
  });

  // Save to localStorage whenever lists change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_OWNED, JSON.stringify(myPaints));
  }, [myPaints]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_FAVORITES, JSON.stringify(favoritePaints));
  }, [favoritePaints]);

  const account = null; // Add logic if you implement accounts

  return (
    <PaintUserContext.Provider value={{
      account,
      myPaints,
      setMyPaints,
      favoritePaints,
      setFavoritePaints
    }}>
      {children}
    </PaintUserContext.Provider>
  );
};

export const usePaintUser = () => useContext(PaintUserContext);