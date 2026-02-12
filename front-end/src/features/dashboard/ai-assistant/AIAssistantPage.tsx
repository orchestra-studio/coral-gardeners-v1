"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import ChatHeader from "./components/ChatHeader";
import ChatMessages from "./components/ChatMessages";
import ChatInput from "./components/ChatInput";
import ChatHistorySidebar from "./components/ChatHistorySidebar";
import { InteractiveSphere } from "./components/interactive-sphere";
import GridBackground from "@/components/GridBackground";
import SplitText from "@/components/SplitText";
import { useChatPage } from "./hooks/useChatPage";
import { useAuth } from "@/store/useAuth";
import { useLocale } from "@/hooks/locale/useLocale";

export default function AIAssistantPage() {
  const t = useTranslations("ai-assistant");
  const { user } = useAuth();
  const locale = useLocale();
  const inputContainerRef = useRef<HTMLDivElement>(null);
  const isRTL = locale === "ar";

  const {
    historyOpen,
    setHistoryOpen,
    register,
    handleFormSubmit,
    hasMessageContent,
    messageValue,
    messages,
    streamingMessage,
    reasoning,
    isLoading,
    status,
    errorMessage,
    providers,
    models,
    selectedModel,
    setSelectedModel,
    modelsLoading,
    sessions,
    handleSubmit,
    handleNewChat,
    handleSelectSession,
    handleDeleteSession,
    handleArchiveSession,
    handleRenameSession,
    stop,
    hasMoreMessages,
    remainingMessages,
    isInitialMessagesLoading,
    isLoadingOlder,
    loadOlderMessages,
    loadAllMessages,
    showInitialSkeleton,
  } = useChatPage();

  const hasMessages =
    messages.length > 0 ||
    Boolean(streamingMessage) ||
    Boolean(reasoning) ||
    (isInitialMessagesLoading && showInitialSkeleton);

  const fallbackName = t("default_user_name");
  const userName = (user?.name || "").trim() || fallbackName;
  const firstName = userName.split(" ")[0];
  const welcomeMessage = t("welcome_user", { name: firstName });
  const welcomeHeading = isRTL ? (
    <SplitText
      text={welcomeMessage}
      tag="h3"
      className="text-xl lg:text-[28px] font-semibold text-[var(--text)]"
      splitType="words"
      delay={200}
      duration={0.1}
      ease="power2.out"
      from={{ opacity: 0, y: 15, scale: 0.8 }}
      to={{ opacity: 1, y: 0, scale: 1 }}
      threshold={0}
    />
  ) : (
    <SplitText
      text={welcomeMessage}
      tag="h3"
      className="text-xl lg:text-[28px] font-semibold text-[var(--text)]"
      splitType="chars"
      delay={30}
      duration={0.6}
      ease="power2.out"
      from={{ opacity: 0, y: 15, scale: 0.8 }}
      to={{ opacity: 1, y: 0, scale: 1 }}
      threshold={0}
    />
  );

  return (
    <div className="relative flex flex-col min-h-[calc(100vh-10rem)] bg-[var(--background)]">
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
        <GridBackground />
      </div>
      <ChatHistorySidebar
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        title={t("chat_history")}
        sessions={sessions}
        onSelectSession={(sessionId) => {
          handleSelectSession(sessionId);
          setHistoryOpen(false);
        }}
        onDeleteSession={handleDeleteSession}
        onArchiveSession={handleArchiveSession}
        onRenameSession={handleRenameSession}
      />

      <ChatHeader
        providers={providers}
        models={models}
        selectedModel={selectedModel}
        onModelChange={setSelectedModel}
        onHistoryClick={() => setHistoryOpen(true)}
        onNewChatClick={handleNewChat}
        isLoading={isLoading}
        modelsLoading={modelsLoading}
        historyLabel={t("chat_history")}
        newChatLabel={t("new_chat")}
      />

      <main className="flex-1 px-0 sm:px-6 lg:px-8 flex pt-16">
        <div
          className={`mx-auto flex w-full max-w-4xl flex-1 flex-col ${
            !hasMessages ? "justify-center items-center" : ""
          }`}
        >
          {!hasMessages ? (
            <div className="flex flex-col items-center w-full -mt-8">
              <div className="flex justify-center px-4 mb-6">
                <InteractiveSphere
                  typedText={messageValue || ""}
                  height="140px"
                  width="140px"
                  segments={16}
                  className="relative z-10"
                  enableAnimation={true}
                  animationDelay={300}
                />
              </div>
              <div className="relative z-10 mb-10">{welcomeHeading}</div>
              <div ref={inputContainerRef} className="w-full relative z-10">
                <ChatInput
                  register={register}
                  onSubmit={handleFormSubmit(handleSubmit)}
                  placeholder={t("input_placeholder")}
                  disabled={isLoading || modelsLoading}
                  hasContent={hasMessageContent}
                  status={
                    status === "streaming"
                      ? "streaming"
                      : status === "error"
                      ? "error"
                      : "ready"
                  }
                  centered={true}
                  onStop={stop}
                />
              </div>
            </div>
          ) : (
            <ChatMessages
              messages={messages}
              streamingMessage={streamingMessage}
              reasoning={reasoning}
              status={status}
              errorMessage={errorMessage || undefined}
              emptyStateTitle={welcomeMessage}
              thinkingLabel={t("thinking")}
              errorLabel={t("error_message")}
              hasMoreMessages={hasMoreMessages}
              remainingCount={remainingMessages}
              onLoadOlder={loadOlderMessages}
              onLoadAll={loadAllMessages}
              isLoadingOlder={isLoadingOlder}
              isInitialLoading={isInitialMessagesLoading}
              showInitialSkeleton={showInitialSkeleton}
            />
          )}
        </div>
      </main>

      {hasMessages && (
        <div className="sticky bottom-2 left-0 right-0 z-10  px-2 sm:px-6 lg:px-8 py-4">
          <div className="relative mx-auto w-full max-w-4xl ">
            <ChatInput
              register={register}
              onSubmit={handleFormSubmit(handleSubmit)}
              placeholder={t("input_placeholder")}
              disabled={isLoading || modelsLoading}
              hasContent={hasMessageContent}
              status={
                status === "streaming"
                  ? "streaming"
                  : status === "submitted"
                  ? "submitted"
                  : status === "error"
                  ? "error"
                  : "ready"
              }
              onStop={stop}
            />
            <div className="absolute bg-[var(--background)] w-[calc(100%-44px)] left-[22px] h-14 -bottom-6 z-0  " />
          </div>
        </div>
      )}
    </div>
  );
}
