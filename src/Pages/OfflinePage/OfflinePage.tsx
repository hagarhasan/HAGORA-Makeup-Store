
export default function OfflinePage() {
    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#fffafb] px-6">

            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-[#f7dbe3]/40 blur-3xl" />

                <div className="absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-[#f4e1e7]/50 blur-3xl" />
            </div>

            <div className="relative w-full max-w-md text-center">
                <div className="mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-3xl border border-[#f0dce2] bg-white shadow-[0_20px_50px_-20px_rgba(169,91,116,0.25)]">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="h-9 w-9 text-[#c8758e]"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 3l18 18M6.75 6.75a10.5 10.5 0 0112.5 0M4.93 10.93a6.75 6.75 0 0114.14 0M8.58 14.58a3 3 0 016.84 0M12 18h.008"
                        />
                    </svg>
                </div>

                <p className="mb-3 text-sm font-bold tracking-[0.25em] text-[#b96880]">
                    HAGORA
                </p>

                <h1 className="text-3xl font-semibold tracking-tight text-[#302429] sm:text-4xl">
                    You&apos;re offline
                </h1>

                <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-[#907c83]">
                    It looks like you&apos;ve lost your internet connection.
                    Check your connection and try again.
                </p>

                <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="mt-8 inline-flex h-12 items-center justify-center rounded-2xl bg-[#171113] px-7 text-sm font-semibold text-white shadow-[0_15px_30px_-14px_rgba(23,17,19,0.5)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#2a2023] hover:shadow-[0_18px_35px_-14px_rgba(23,17,19,0.55)] active:translate-y-0"
                >
                    Try again
                    <span className="ml-2 text-base">↻</span>
                </button>

                <p className="mt-6 text-[11px] text-[#b3a1a7]">
                    Check your internet connection and try again.
                </p>
            </div>
        </main>
    );
}