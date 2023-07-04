import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { Navbar } from "~/components/Navbar";
import { api } from "~/utils/api";

import "~/styles/globals.css";
import { Montserrat } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import Router from "next/router";
import NextNProgress from "nextjs-progressbar";
import NProgress from "nprogress";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  NProgress.configure({ showSpinner: false });

  useEffect(() => {
    Router.events.on("routeChangeStart", (url) => {
      NProgress.start();
    });
    Router.events.on("routeChangeComplete", (url) => {
      NProgress.done(true);
    });

    Router.events.on("routeChangeError", (url) => {
      NProgress.done(true);
    });
  }, [Router]);

  return (
    <div className={`${montserrat.variable} font-sans`}>
      <SessionProvider session={session}>
        <NextNProgress color="#EA0061" />
        <Toaster position="bottom-center" reverseOrder={false} />
        <Navbar />
        <Component {...pageProps} />
        {/* <Footer /> */}
      </SessionProvider>
    </div>
  );
};

export default api.withTRPC(MyApp);
