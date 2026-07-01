"use client";

export default function Loader({ text = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 animate-fade-in">
      <div className="w-10 h-10 border-3 border-brand-orange border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-gray-400 font-medium">{text}</p>
    </div>
  );
}
