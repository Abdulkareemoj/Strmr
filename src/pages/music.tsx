import { GetServerSideProps } from "next";
import MusicPage from "~/components/MusicPage";
import { requireAuth } from "~/lib/auth";
export default function Music() {
  return <MusicPage />;
}
export const getServerSideProps: GetServerSideProps = async (context) => {
  return requireAuth(context);
};
