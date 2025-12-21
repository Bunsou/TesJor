interface EmptyStateProps {
  message?: string;
}

export function EmptyState({
  message = "No items found. Try a different search or category.",
}: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <p className="text-gray-500 text-lg">{message}</p>
    </div>
  );
}
