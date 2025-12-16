const ImagePreviewModal = ({ url, onClose }) => {
  if (!url) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 bg-white text-black rounded-full px-1.5 py-1 text-xs shadow cursor-pointer hover:bg-gray-200 transition"
      >
        ✖
      </button>
      <img
        src={url}
        alt="preview"
        className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
      />
    </div>
  );
};

export default ImagePreviewModal;
