import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { Navbar } from "~/components/Navbar";
import { api } from "~/utils/api";

import "~/styles/globals.css";
import { Montserrat } from "next/font/google";
import { Footer } from "~/components/Footer";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <div className={`${montserrat.variable} font-sans`}>
      <SessionProvider session={session}>
        <Navbar />
        <Component {...pageProps} />
        {/* <Footer /> */}
      </SessionProvider>
    </div>
  );
};

export default api.withTRPC(MyApp);
