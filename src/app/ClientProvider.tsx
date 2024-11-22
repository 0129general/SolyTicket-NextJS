// ClientProvider.tsx
"use client";

import React from "react";
import { Provider } from "react-redux";
import { store } from "../../redux/app/store";
import { ThemeProvider as MaterialThemeProvider } from "@material-tailwind/react";
import { CustomThemeProvider } from "./context/ThemeContext";

const ClientProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <MaterialThemeProvider>
        <CustomThemeProvider>{children}</CustomThemeProvider>
      </MaterialThemeProvider>
    </Provider>
  );
};

export default ClientProvider;
