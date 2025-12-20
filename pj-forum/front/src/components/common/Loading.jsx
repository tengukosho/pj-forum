export default function Loading({ text = 'Đang tải...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-12 h-12 border-4 border-voz-blue border-t-transparent rounded-full animate-spin mb-3"></div>
      <p className="text-sm text-voz-gray">{text}</p>
    </div>
  );
}
