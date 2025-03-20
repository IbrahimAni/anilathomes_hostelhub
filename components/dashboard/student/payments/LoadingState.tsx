export default function LoadingState() {
  return (
    <div className="flex items-center justify-center min-h-[70vh]" data-testid="payment-loading">
      <div className="w-12 h-12 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
    </div>
  );
}
