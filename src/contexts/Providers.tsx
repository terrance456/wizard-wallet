import dynamic from "next/dynamic";
import React, { PropsWithChildren } from "react";

const ThemeProvider = dynamic(() => import("./ThemeContext"), { ssr: false, loading: () => <div className="p-5">Loading...</div> });

const Providers: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      {children}
    </ThemeProvider>
  );
};

export default Providers;
