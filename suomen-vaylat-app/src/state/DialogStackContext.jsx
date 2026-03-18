// AI-GENERATED
// GPT-5.4 Think deeper
// Inspected by Oskari Rintamäki
// Date: 2026-03-12

import React, {
  createContext,
  useContext,
  useCallback,
  useMemo,
  useState
} from 'react';

const DialogStackContext = createContext(null);

export const useDialogStack = () => useContext(DialogStackContext);

/**
 * orderedIds = bottom -> top
 * topId = last item in orderedIds
 */
export const DialogStackProvider = ({ children, baseZ = 12 }) => {
  const [orderedIds, setOrderedIds] = useState([]);

  const register = useCallback((id) => {
    if (!id) return;
    setOrderedIds((prev) => {
      if (prev.includes(id)) return prev;
      return [...prev, id];
    });
  }, []);

  const unregister = useCallback((id) => {
    if (!id) return;
    setOrderedIds((prev) => prev.filter((x) => x !== id));
  }, []);

  const bringToFront = useCallback((id) => {
    if (!id) return;
    setOrderedIds((prev) => {
      const filtered = prev.filter((x) => x !== id);
      return [...filtered, id];
    });
  }, []);

  const getZIndex = useCallback(
    (id) => {
      const index = orderedIds.indexOf(id);
      if (index === -1) return baseZ;
      return baseZ + index;
    },
    [orderedIds, baseZ]
  );

  const topId =
    orderedIds.length > 0 ? orderedIds[orderedIds.length - 1] : null;

  const value = useMemo(
    () => ({
      orderedIds,
      topId,
      register,
      unregister,
      bringToFront,
      getZIndex
    }),
    [orderedIds, topId, register, unregister, bringToFront, getZIndex]
  );

  return (
    <DialogStackContext.Provider value={value}>
      {children}
    </DialogStackContext.Provider>
  );
};