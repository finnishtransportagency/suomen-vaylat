import React, { createContext, useContext, useRef, useCallback, useState } from 'react';

// AI-GENERATED
// Inspected by Oskari Rintamäki
// Date: 2026-03-02 

const DialogStackContext = createContext(null);

export const useDialogStack = () => useContext(DialogStackContext);

/**
 * Provider to control z-indexes for dialogs
 */
export const DialogStackProvider = ({ children, baseZ = 12 }) => {
  const nextZRef = useRef(baseZ);
  const [topId, setTopId] = useState(null);

  const bringToFront = useCallback((id) => {
    nextZRef.current += 1;
    setTopId(id);
    return nextZRef.current;
  }, []);

  const assignInitialZ = useCallback((id) => {
    setTopId(id);
    nextZRef.current += 1;
    return nextZRef.current;
  }, []);

  return (
    <DialogStackContext.Provider value={{ bringToFront, assignInitialZ, topId, currentZ: nextZRef.current }}>
      {children}
    </DialogStackContext.Provider>
  );
};
