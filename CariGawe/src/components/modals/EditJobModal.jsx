import { useState, useEffect } from "react";

function EditJobModal({ isOpen, onClose, job, onSave }) {
    const [formData, setFormData] = useState({});

    useEffect(() => {
        if (job) {
            setFormData({
                judul: job.judul || '',
                deskripsi: job.deskripsi || ''
            });
        }
    }, [job]);

    if (!isOpen || !job) return null;
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        onSave(job.id, formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl w-1/3 font-montserrat">
                <h2 className="text-2xl font-bold mb-6 text-blue7">Edit Lowongan</h2>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="judul" className="block text-sm font-medium text-gray-700">Judul Pekerjaan</label>
                        <input
                            type="text"
                            name="judul"
                            id="judul"
                            value={formData.judul}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue7 focus:border-blue7"
                        />
                    </div>
                    <div>
                        <label htmlFor="deskripsi" className="block text-sm font-medium text-gray-700">Deskripsi</label>
                        <textarea
                            name="deskripsi"
                            id="deskripsi"
                            rows="4"
                            value={formData.deskripsi}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue7 focus:border-blue7"
                        ></textarea>
                    </div>
                </div>
                <div className="mt-8 flex justify-end gap-4">
                    <button onClick={onClose} className="py-2 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
                        Batal
                    </button>
                    <button onClick={handleSave} className="py-2 px-4 bg-blue7 text-white rounded-lg hover:bg-blue-800">
                        Simpan Perubahan
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EditJobModal;