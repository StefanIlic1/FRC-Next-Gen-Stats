export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-blue-950 text-white">
      <main className="flex min-h-screen w-full max-w-6xl flex-col items-center justify-between py-32 px-16">
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-sky-400">
            Welcome to FRC Next Gen Stats
          </h1>
          <p className="max-w-md text-lg leading-8 text-white">
            Click to see cool things.
          </p>
            <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-sky-300 text-blue-950 transition-colors hover:bg-gray-200 md:w-[170px]"
            href="/stats"
            >
            See Cool Things
            </a>
        </div>
      </main>
    </div>
  );
}
