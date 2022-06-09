import type { AppProps } from "next/app";
import {
  Connect,
  AuthOptions,
  AppConfig,
  UserSession,
} from "@stacks/connect-react";

import { SessionProvider } from "next-auth/react";

export const appConfig = new AppConfig([]);
export const userSession = new UserSession({ appConfig });
export const appDetails = {
  name: "STX Profiles ",
  icon: "https://stx-profiles-theta.vercel.app/stacks.png",
};

function MyApp({ Component, pageProps }: AppProps) {
  const authOptions: AuthOptions = {
    redirectTo: "/",
    appDetails,
    userSession,
  };

  return (
    <Connect authOptions={authOptions}>
      <SessionProvider session={pageProps.session} refetchInterval={0}>
        <Component {...pageProps} />
      </SessionProvider>
    </Connect>
  );
}

export default MyApp;