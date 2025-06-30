function DeleteConfirmationModal({ isOpen, onClose, onConfirm }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl w-auto font-montserrat text-center">
                <h2 className="text-xl font-bold mb-4 text-gray-800">Konfirmasi Hapus</h2>
                <p className="text-gray-600 mb-6">
                    Apakah Anda yakin ingin menghapus lowongan ini? <br/> Tindakan ini tidak dapat dibatalkan.
                </p>
                <div className="flex justify-center gap-4">
                    <button onClick={onClose} className="py-2 px-5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
                        Batal
                    </button>
                    <button onClick={onConfirm} className="py-2 px-5 bg-mainRed text-white rounded-lg hover:bg-red-700">
                        Ya, Hapus
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DeleteConfirmationModal;