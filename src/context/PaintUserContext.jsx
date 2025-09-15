// PaintUserContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const PaintUserContext = createContext();

export const PaintUserProvider = ({ children }) => {
  const account = null; // or your logic
  const [myPaints, setMyPaints] = useState([]);
  const [favoritePaints, setFavoritePaints] = useState([]);

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

export const usePaintUser = () => {
  const ctx = useContext(PaintUserContext);
  console.log('PaintUserContext value:', ctx);
  return ctx;
};