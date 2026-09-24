import React, { createContext, useState, useCallback } from "react";
import { Notice } from "../App.styles";

export interface NoticeContextProps {
  showNotice: (text: string) => void;
}

export const NoticeContext = createContext<NoticeContextProps | null>(null);

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
