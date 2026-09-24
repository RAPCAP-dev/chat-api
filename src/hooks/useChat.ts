import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === null) {
    throw new Error("useChat must be used within ChatProvider");
  }
  return context;
};
