const SKELETON_COUNT = 8

function ProductCardSkeleton({ className = '' }: { className?: string }) {
    return (
        <div
            className={`overflow-hidden rounded-2xl border border-pink-100 bg-white shadow-sm ${className}`}
        >
            {/* Image */}
            <div className="aspect-square w-full bg-pink-50" />

            <div className="space-y-3 p-4">
                {/* Category */}
                <div className="h-3 w-1/3 rounded-full bg-pink-100" />
                {/* Title */}
                <div className="h-4 w-4/5 rounded-full bg-gray-200" />
                <div className="h-4 w-3/5 rounded-full bg-gray-200" />

                {/* Price + button */}
                <div className="flex items-center justify-between pt-2">
                    <div className="h-5 w-20 rounded-full bg-pink-100" />
                    <div className="h-9 w-9 rounded-full bg-pink-100" />
                </div>
            </div>
        </div>
    )
}

export default function Loading() {
    return (
        <div role="status" aria-live="polite" aria-busy="true" className="w-full">
            <span className="sr-only">Loading HAGORA products...</span>

            {/* Heading placeholder */}
            <div className="mb-6 flex items-center justify-between animate-pulse motion-reduce:animate-none">
                <div className="space-y-2">
                    <div className="h-6 w-40 rounded-full bg-pink-100" />
                    <div className="h-3 w-56 rounded-full bg-gray-200" />
                </div>
                <div className="hidden h-10 w-36 rounded-xl bg-pink-50 sm:block" />
            </div>

            {/* Products grid: 1 column on phones */}
            <div
                className="grid grid-cols-1 gap-4 animate-pulse motion-reduce:animate-none sm:grid-cols-2 sm:gap-5 md:grid-cols-3 lg:grid-cols-4"
                aria-hidden="true"
            >
                {Array.from({ length: SKELETON_COUNT }, (_, index) => (
                    <ProductCardSkeleton
                        key={index}
                        // On phones show only the first 2 cards; from sm up show all
                        className={index >= 2 ? 'hidden sm:block' : ''}
                    />
                ))}
            </div>

            {/* Soft hint */}
            <div className="mt-10 flex justify-center" aria-hidden="true">
                <div className="inline-flex items-center gap-3 rounded-full border border-pink-100 bg-pink-50/70 px-5 py-2.5 shadow-sm">
                    <span className="flex items-center gap-1">
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-pink-400 motion-reduce:animate-none" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-pink-500 [animation-delay:150ms] motion-reduce:animate-none" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-pink-600 [animation-delay:300ms] motion-reduce:animate-none" />
                    </span>

                    <span className="text-sm font-medium text-pink-700">
                        Preparing your beauty collection
                    </span>
                </div>
            </div>
        </div>
    )
}