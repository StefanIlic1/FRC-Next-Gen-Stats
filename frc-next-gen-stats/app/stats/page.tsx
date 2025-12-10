const Stats = () => {
    return (
        <div className="flex min-h-screen items-center justify-center bg-blue-950 text-white">
        <main className="flex min-h-screen w-full max-w-6xl flex-col items-center justify-between py-32 px-16">
            <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
            <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-sky-400">
                Peep Some Stats Here
            </h1>
            <a
                className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-sky-300 text-blue-950 transition-colors hover:bg-gray-200 md:w-[170px]"
                href="https://www.thebluealliance.com/team/3061"
                target="_blank"
                rel="noopener noreferrer"
            >
                Statistics
            </a>
            <a
                className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-black text-sky-300 transition-colors hover:bg-gray-500 md:w-[170px]"
                href="/"
            >
                Home
            </a>
            </div>
        </main>
        </div>
    );
}

export default Stats;