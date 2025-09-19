import { Info } from 'lucide-react';

const DeltaEInfoModal = ({ open, onClose }) => {
  if (!open) return null;

  // Close modal if user clicks outside the modal content
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-lg font-semibold mb-2 flex items-center">
          <Info className="w-5 h-5 mr-2 text-blue-600" />
          What is Delta E?
        </h2>
        <p className="mb-2">
          <b>Delta E</b> (ΔE) is a metric for understanding how the human eye perceives color difference. A lower Delta E means colors are more similar; a higher Delta E means they are more different.
        </p>
        <p>
          We use Delta E to find paints that are visually closest to your selected color, so you can discover near matches or alternatives.
        </p>
      </div>
    </div>
  );
};

export default DeltaEInfoModal;