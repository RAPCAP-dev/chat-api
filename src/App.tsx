import { Workspace, AppWrapper } from "./App.styles";
import { ChatProvider, NoticeProvider } from "./context";
import { useChat } from "./hooks";
import { AppHeader, ChatPanel, SettingsModal, Sidebar } from "./ui";

function MainLayout() {
  const { isSettingsOpen } = useChat();

  return (
    <AppWrapper>
      <AppHeader />
      <Workspace>
        <Sidebar />
        <ChatPanel />
      </Workspace>
      {isSettingsOpen && <SettingsModal />}
    </AppWrapper>
  );
}

export default function App() {
  return (
    <NoticeProvider>
      <ChatProvider>
        <MainLayout />
      </ChatProvider>
    </NoticeProvider>
  );
}
