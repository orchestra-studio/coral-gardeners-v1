"use client";

import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { ProgressProvider } from "@bprogress/next/app";
import { ThemeProvider } from "../../providers/ThemeProvider";
import { ApiProvider } from "../../providers/ApiProvider";
import QueryProvider from "../../providers/QueryProvider";
import AuthSync from "../../providers/AuthSync";
import { WebSocketProvider } from "../../providers/WebSocketProvider";
import { store, persistor } from "../../store";
import { ToastContainer } from "react-toastify";
import { useLocale } from "@/hooks/locale/useLocale";
import "react-toastify/dist/ReactToastify.css";

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers = ({ children }: ProvidersProps) => {
  const locale = useLocale();
  const isRTL = locale === "ar";

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ProgressProvider
          height="1px"
          color="var(--accent-1)"
          options={{
            showSpinner: false,
            minimum: 0.1,
            speed: 500,
            trickleSpeed: 200,
          }}
        >
          <ThemeProvider>
            <QueryProvider>
              <ApiProvider>
                <WebSocketProvider>
                  <AuthSync />
                  {children}
                  {/* React Toastify Container */}
                  <ToastContainer
                    position={isRTL ? "top-left" : "top-right"}
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={isRTL}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    className="top-22!"
                    toastClassName="!text-sm !rounded-md !shadow-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text)]"
                  />
                </WebSocketProvider>
              </ApiProvider>
            </QueryProvider>
          </ThemeProvider>
        </ProgressProvider>
      </PersistGate>
    </Provider>
  );
};

export default Providers;
