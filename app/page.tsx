import dynamic from "next/dynamic";

const LandingPage = dynamic(
  () => import('./LandingPage').then(mod => mod.LandingPage),
  {
    ssr: true,
  }
)

export default function Home() {
  return (
    <>
        <LandingPage />
    </>
  );
}
