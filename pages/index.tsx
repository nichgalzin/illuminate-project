import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  const router = useRouter();

  // Redirect to the questionnaire page by default
  useEffect(() => {
    router.push('/questionnaire');
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <Head>
        <title>Risk Assessment App</title>
        <meta name="description" content="Full risk assessment application" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center w-full text-center">
        <h1 className="text-4xl font-bold mb-4">Loading Risk Assessment App...</h1>
        <p className="text-lg mb-8">Please wait while we redirect you to the questionnaire.</p>
      </main>
    </div>
  );
}
