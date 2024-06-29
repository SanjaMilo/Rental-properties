"use client";
// This will be a client component that's why we are making it a separate file, and will import it in the layout file (server component) and wrap everything in this AuthProvider

import { SessionProvider } from "next-auth/react";

const AuthProvider = ({ children }) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default AuthProvider;
