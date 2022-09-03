import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";
import BaseLayout from "~/components/BaseLayout";
import "~/global.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <BaseLayout>
        <Component {...pageProps} />
      </BaseLayout>
    </SessionProvider>
  );
};

