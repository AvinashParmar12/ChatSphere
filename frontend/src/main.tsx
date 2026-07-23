import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { Provider } from "react-redux";

import { store } from "@/store";

import App from "./App";
import "./index.css";

import AuthInitializer from "@/features/auth/components/AuthInitializer";
import { SocketProvider } from "@/socket/SocketProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <AuthInitializer>
        <SocketProvider>
          <App />
        </SocketProvider>
      </AuthInitializer>
    </Provider>
  </StrictMode>
);