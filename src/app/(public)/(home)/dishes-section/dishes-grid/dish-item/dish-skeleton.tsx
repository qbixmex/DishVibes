export const DishSkeleton = () => {
  return (
    <div className="w-full border border-input bg-input/50 rounded-lg p-5">
      <div className="flex flex-col gap-5">
        <div className="w-full h-50 bg-gray-700 rounded-md" />
        <div className="w-full h-10 bg-gray-700 rounded-md" />
        <div className="w-full h-5 bg-gray-700 rounded-md" />
        <div className="w-2/3 h-5 bg-gray-700 rounded-md" />
        <div className="flex items-center justify-between">
          <div className="w-20 h-5 bg-gray-700 rounded-md" />
          <div className="w-25 h-10 bg-gray-700 rounded-md" />
        </div>
      </div>
    </div>
  );
};