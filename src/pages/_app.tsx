import { type AppType } from "next/app";
import { ThemeProvider } from "next-themes";
import "~/styles/globals.css";
import Layout from "~/components/Layout";

const MyApp: AppType = ({ Component, pageProps: { ...pageProps } }) => {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
};

export default MyApp;
