import { useContext } from "react";
import { NoticeContext } from "../context/NoticeContext";

export const useNotice = () => {
  const context = useContext(NoticeContext);
  if (context === null) {
    throw new Error("useNotice must be used within NoticeProvider");
  }
  return context;
};
