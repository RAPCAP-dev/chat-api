import React, { createContext, useContext, useState, useCallback } from "react";
import { Notice } from "../App.styles";

interface NoticeContextProps {
  showNotice: (text: string) => void;
}

const NoticeContext = createContext<NoticeContextProps | undefined>(undefined);

export const NoticeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notice, setNotice] = useState("");

  const showNotice = useCallback((text: string) => {
    setNotice(text);
    window.setTimeout(() => setNotice(""), 3000);
  }, []);

  return (
    <NoticeContext.Provider value={{ showNotice }}>
      {children}
      {notice && <Notice>{notice}</Notice>}
    </NoticeContext.Provider>
  );
};

export const useNotice = () => {
  const context = useContext(NoticeContext);
  if (!context) throw new Error("useNotice must be used within NoticeProvider");
  return context;
};
