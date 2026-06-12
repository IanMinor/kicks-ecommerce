export function Skeleton({ className = "" }) {
  return (
    <div
      className={`animate-pulse bg-gray-200 rounded-lg ${className}`}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="w-[300px] flex flex-col">
      <div className="rounded-[28px] overflow-hidden">
        <Skeleton className="w-full h-[280px] rounded-[28px]" />
      </div>
      <Skeleton className="h-7 w-3/4 mt-4 mx-auto" />
      <Skeleton className="h-11 w-full mt-4 rounded-lg" />
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="flex flex-col md:flex-row gap-8 p-4 mt-7 items-center md:items-start md:justify-center max-w-5xl mx-auto">
      <Skeleton className="w-full max-w-[400px] h-[400px] rounded-2xl" />
      <div className="flex flex-col gap-3 flex-1">
        <Skeleton className="h-5 w-24 rounded" />
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-16 w-full mt-2" />
        <Skeleton className="h-5 w-16 mt-4" />
        <Skeleton className="h-10 w-16 mt-2" />
        <Skeleton className="h-11 w-full mt-6 rounded-lg" />
        <Skeleton className="h-11 w-full rounded-lg" />
      </div>
    </div>
  );
}

export function CartItemSkeleton() {
  return (
    <div className="flex w-full rounded-lg p-4 gap-6 bg-white shadow">
      <Skeleton className="w-[180px] h-[180px] rounded-[24px] flex-shrink-0" />
      <div className="flex flex-col justify-between w-full">
        <div>
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full mt-2" />
          <div className="flex gap-4 mt-3">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <div className="flex justify-between items-center mt-4">
          <Skeleton className="h-6 w-20" />
          <div className="flex gap-4">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-5 w-5 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function OrderSummarySkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-[400px]">
      <Skeleton className="h-8 w-48 mb-4" />
      <Skeleton className="h-5 w-full mb-2" />
      <Skeleton className="h-8 w-full mt-4" />
      <Skeleton className="h-10 w-full mt-4 rounded-lg" />
    </div>
  );
}
