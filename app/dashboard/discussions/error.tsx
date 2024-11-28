'use client';

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        <h2 className="text-lg font-semibold mb-2">Something went wrong!</h2>
        <p className="mb-4">{error.message}</p>
        <button
          onClick={reset}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}