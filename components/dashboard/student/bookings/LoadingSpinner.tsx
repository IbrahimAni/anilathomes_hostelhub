export default function LoadingSpinner() {
  return (
    <div data-testid="loading-spinner" className="flex items-center justify-center min-h-[70vh]">
      <div className="w-12 h-12 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
    </div>
  );
}
