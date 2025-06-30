import { useState, useRef } from 'react';
import supabase from '../utils/supabaseClient';

function ApplyModal({ isOpen, onClose, jobTitle, companyEmail, companyName, onShowNotification }) {
    const [applicantName, setApplicantName] = useState('');
    const [applicantEmail, setApplicantEmail] = useState('');
    const [cvFile, setCvFile] = useState(null);
    const [fileName, setFileName] = useState("Unggah CV di sini");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const cvRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCvFile(file);
            setFileName(file.name);
            setError(''); // Clear previous file-related errors
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!applicantName || !applicantEmail || !cvFile) {
            setError("Nama, Email, dan CV wajib diisi.");
            return;
        }

        setIsLoading(true);
        setError('');

        const formData = new FormData();
        formData.append('applicantName', applicantName);
        formData.append('applicantEmail', applicantEmail);
        formData.append('cv', cvFile);
        formData.append('jobTitle', jobTitle);
        formData.append('companyEmail', companyEmail);
        formData.append('companyName', companyName);

        try {
            const { data, error: functionError } = await supabase.functions.invoke('send-application', {
                body: formData,
            });

            if (functionError) {
                throw functionError;
            }

            // Trigger notification on parent component
            onShowNotification('Lamaran berhasil dikirim!', 'success');
            onClose(); // Close modal
            setApplicantName('');
            setApplicantEmail('');
            setCvFile(null);
            setFileName("Unggah CV di sini");

        } catch (err) {
            console.error("Error submitting application:", err);
            onShowNotification(`Gagal mengirim lamaran: ${err.message || 'Terjadi kesalahan.'}`, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md relative">
                <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
                <h2 className="text-2xl font-bold font-baskerville mb-2">Siap untuk Melamar?</h2>
                <p className="text-gray-600 mb-6">Lengkapi data Anda dan mulai lamaran online Anda.</p>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Nama:"
                            value={applicantName}
                            onChange={(e) => setApplicantName(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <input
                            type="email"
                            placeholder="Email:"
                            value={applicantEmail}
                            onChange={(e) => setApplicantEmail(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-6">
                         <div className="relative border border-gray-300 rounded-lg font-montserrat">
                            <label htmlFor="fieldCvModal" className="flex items-center cursor-pointer">
                                <span className="bg-gray-200 px-4 py-3 rounded-l-lg text-gray-700">Pilih File</span>
                                <span className="px-3 text-gray-500 truncate">{fileName}</span>
                            </label>
                            <input ref={cvRef} onChange={handleFileChange} type="file" id="fieldCvModal" accept=".pdf,.doc,.docx,image/png,image/jpeg" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" required/>
                        </div>
                    </div>
                    
                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                    <button type="submit" disabled={isLoading} className="font-montserrat font-bold text-white bg-blue6 w-full py-3 rounded-xl hover:bg-blue7 transition-colors disabled:bg-gray-400">
                        {isLoading ? 'Mengirim...' : 'Lamar Sekarang'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ApplyModal;
