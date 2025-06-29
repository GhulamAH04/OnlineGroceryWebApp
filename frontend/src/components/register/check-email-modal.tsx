"use client";

import { X } from "lucide-react";

interface props {
  userName: string;
  isVisible: boolean;
  onClose: () => void;
}

export default function CheckEmailModal({
  userName,
  isVisible,
  onClose,
}: props) {
  if (!isVisible) return null;

  // Close modal when clicking outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-black/50 backdrop-blur-sm
        transition-opacity duration-300
        overflow-y-auto p-4
      "
      onClick={handleBackdropClick}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="
        w-full max-w-6xl
        bg-white rounded-xl
        shadow-xl
        overflow-hidden
        animate-fade-in
      "
      >
        {/* Modal Header */}
        <div
          className="
          flex items-center justify-between
          p-4 sm:p-6
          border-b border-gray-100
          sticky top-0 bg-white z-10
        "
        >
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
            Hi {userName}
          </h2>
          <button
            onClick={onClose}
            className="
              p-2 rounded-full
              text-gray-500 hover:text-gray-700
              hover:bg-gray-100
              transition-colors
              focus:outline-none focus:ring-2 focus:ring-green-500
            "
            aria-label="Close check email modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
