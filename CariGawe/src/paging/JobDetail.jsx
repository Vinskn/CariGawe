import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import JobDetailComponent from "../components/JobDetailComponent";
import supabase from '../utils/supabaseClient';
import ApplyModal from "../components/ApplyModal";

const formatRupiah = (number) => {
    if (number === null || isNaN(number)) {
        return "N/A";
    }
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(number);
};

function JobDetail() {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState("desc");
    const [jobData, setJobData] = useState(null);
    const [otherJobs, setOtherJobs] = useState([]);
    const [jobCount, setJobCount] = useState(0); // State untuk jumlah pekerjaan
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [notificationType, setNotificationType] = useState('');

    useEffect(() => {
        let timer;
        if (showNotification) {
            timer = setTimeout(() => {
                setShowNotification(false);
                setNotificationMessage('');
                setNotificationType('');
            }, 3000);
        }
        return () => clearTimeout(timer);
    }, [showNotification]);

    const handleShowNotification = (message, type) => {
        setNotificationMessage(message);
        setNotificationType(type);
        setShowNotification(true);
    };

    const handleActiveTab = (tabName) => {
        setActiveTab(tabName);
    };

    useEffect(() => {
        const fetchJobData = async () => {
            if (!id) return;

            setIsLoading(true);
            setOtherJobs([]);
            setJobCount(0);
            
            const { data: currentJob, error: currentJobError } = await supabase
                .from('pekerjaan')
                .select('*, perusahaan(*)')
                .eq("id", id)
                .single();

            if (currentJobError) {
                console.error("Error fetching job data:", currentJobError);
                setIsLoading(false);
                return;
            }
            
            setJobData(currentJob);

            if (currentJob && currentJob.perusahaan_id) {
                // Fetch other jobs from the same company
                const { data: otherJobsData, error: otherJobsError } = await supabase
                    .from('pekerjaan')
                    .select('id, judul, lokasi')
                    .eq('perusahaan_id', currentJob.perusahaan_id)
                    .neq('id', id)
                    .limit(3);

                if (otherJobsError) {
                    console.error("Error fetching other jobs:", otherJobsError);
                } else {
                    setOtherJobs(otherJobsData);
                }

                // Fetch total active job count for the company
                const { count, error: countError } = await supabase
                    .from('pekerjaan')
                    .select('*', { count: 'exact', head: true })
                    .eq('perusahaan_id', currentJob.perusahaan_id)
                    .eq('status', 'aktif');
                
                if (countError) {
                    console.error("Error fetching job count:", countError);
                } else {
                    setJobCount(count);
                }
            }
            
            setIsLoading(false);
        };

        fetchJobData();
    }, [id]);

    if (isLoading) {
        return (
            <>
                <Navbar fromPage={1} />
                <div className="flex justify-center items-center h-screen">Loading...</div>
                <Footer />
            </>
        )
    }

    if (!jobData) {
         return (
            <>
                <Navbar fromPage={1} />
                <div className="flex justify-center items-center h-screen">Pekerjaan tidak ditemukan.</div>
                <Footer />
            </>
        )
    }
    
    const companyEmail = jobData.perusahaan?.email_perusahaan || `hr@${jobData.perusahaan?.nama_perusahaan.toLowerCase().replace(/\s/g, '')}.com`;

    return (
        <>
            <Navbar fromPage={1} />
            <div className="pt-24">
                <div className="bg-cover bg-center py-12 px-8" style={{ backgroundImage: "url('/images/background-jobdetail.png')" }}>
                    <div className="max-w-7xl mx-auto flex justify-between items-center">
                        <div className="w-1/2">
                            <div className="flex gap-3">
                                <span className="font-montserrat bg-tagYellow text-textTagYellow px-3 py-1 rounded-lg text-sm">{jobData.status}</span>
                                <span className="font-montserrat bg-tagGreen text-textTagGreen px-3 py-1 rounded-lg text-sm">{jobData.tipe_pekerjaan}</span>
                            </div>
                            <h1 className="mt-4 text-4xl text-white font-baskerville font-semibold">{jobData.judul}</h1>
                            <div className="flex gap-4 items-center text-white font-montserrat mt-4">
                                <span>{jobData.lokasi}</span>
                                <div className="flex items-center">
                                    <span className="text-yellow-400">
                                        {Array(jobData.rating || 0).fill(0).map((_, i) => <span key={i}>★</span>)}
                                        {Array(5 - (jobData.rating || 0)).fill(0).map((_, i) => <span key={i} className="text-gray-300">★</span>)}
                                    </span>
                                    <span className="text-white ml-2">({jobData.rating || 0}.0)</span>
                                </div>
                            </div>
                            <p className="text-white font-baskerville mt-2">{jobData.deskripsi_singkat}</p>
                        </div>
                        <div className="text-right">
                             <img src={'/images/google.svg'} alt={`${jobData.perusahaan?.nama_perusahaan} logo`} className="w-20 h-20 object-contain ml-auto mb-2 rounded-lg bg-white p-1" />
                            <p className="text-white font-bold font-baskerville text-2xl">{jobData.perusahaan?.nama_perusahaan || 'Nama Perusahaan'}</p>
                            <div className="flex justify-end gap-6 font-montserrat text-white mt-5">
                                <div className="border-r border-gray-400 pr-6">
                                    <h2 className="text-sm opacity-80">Department</h2>
                                    <p className="text-lg font-bold">{jobData.kategori}</p>
                                </div>
                                <div>
                                    <h2 className="text-sm opacity-80">Salary</h2>
                                    <p className="text-lg font-bold">{formatRupiah(jobData.salary)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between gap-8 mt-10 px-8">
                    <div className="w-full lg:w-7/12">
                        <div className="flex justify-start gap-8 font-montserrat text-gray-500 border-b">
                            <h2 className={`pb-2 ${activeTab === "desc" ? "text-blue5 border-b-2 border-blue5" : ""} cursor-pointer select-none`}
                                onClick={() => handleActiveTab("desc")}>
                                Deskripsi Pekerjaan
                            </h2>
                            <h2 className={`pb-2 ${activeTab === "syarat" ? "text-blue5 border-b-2 border-blue5" : ""} cursor-pointer select-none`}
                                onClick={() => handleActiveTab("syarat")}>
                                Persyaratan
                            </h2>
                            <h2 className={`pb-2 ${activeTab === "ulasan" ? "text-blue5 border-b-2 border-blue5" : ""} cursor-pointer select-none`}
                                onClick={() => handleActiveTab("ulasan")}>
                                Ulasan Perusahaan
                            </h2>
                        </div>
                        <JobDetailComponent>
                            {activeTab === "desc" && <JobDetailComponent.JobDescription descData={jobData.deskripsi} />}
                            {activeTab === "syarat" && <JobDetailComponent.JobRequisite requistData={jobData.syarat_kerja} />}
                            {activeTab === "ulasan" && <JobDetailComponent.CompanyReview companyId={jobData.perusahaan_id} />}
                        </JobDetailComponent>
                    </div>

                    <div className="w-full lg:w-4/12">
                        <div className="p-6 border border-gray-200 rounded-2xl shadow-sm">
                            <h3 className="text-gray-800 font-montserrat font-bold text-2xl">Siap untuk Melamar?</h3>
                            <p className="text-gray-600 text-sm mt-2 mb-5">Lengkapi daftar periksa kelayakan sekarang dan mulai lamaran online Anda.</p>
                            
                            <button 
                                onClick={() => setIsModalOpen(true)}
                                className="font-montserrat font-bold text-white bg-blue6 w-full py-3 rounded-xl mt-4 hover:bg-blue7 transition-colors">
                                Lamar Sekarang
                            </button>
                        </div>
                        <div className="mt-6 p-6 border border-gray-200 rounded-2xl shadow-sm">
                             <div className="flex items-center gap-4 border-b border-gray-200 pb-4">
                                <img src={'/images/google.svg'} alt={`${jobData.perusahaan?.nama_perusahaan} logo`} className="w-16 h-16 object-contain rounded-lg bg-white p-1" />
                                <div>
                                    <h3 className="font-montserrat font-bold text-gray-800 text-xl">{jobData.perusahaan?.nama_perusahaan || 'Nama Perusahaan'}</h3>
                                    <p className="font-montserrat text-gray-500 text-sm">{jobData.perusahaan?.alamat || 'Lokasi Perusahaan'}</p>
                                </div>
                            </div>
                           
                            <div className="space-y-4 mt-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="text-gray-500 font-montserrat text-sm">Lowongan Aktif</h4>
                                        <p className="text-gray-800 font-montserrat font-semibold">{jobCount} Posisi</p>
                                    </div>
                                    <div>
                                        <h4 className="text-gray-500 font-montserrat text-sm">Website</h4>
                                        {jobData.perusahaan?.website ? (
                                            <a 
                                                href={jobData.perusahaan.website} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="text-blue-600 hover:underline break-all"
                                            >
                                                {jobData.perusahaan.website}
                                            </a>
                                        ) : (
                                            <p className="text-gray-800 font-montserrat font-semibold">-</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-gray-500 font-montserrat text-sm">Tentang Perusahaan</h4>
                                    <p className="text-gray-800 font-montserrat font-semibold">{jobData.perusahaan?.deskripsi || '-'}</p>
                                </div>
                                <hr/>
                                <div>
                                    <h4 className="text-gray-800 font-montserrat font-semibold mb-3">
                                        Lowongan lain dari perusahaan ini
                                    </h4>
                                    {otherJobs.length > 0 ? (
                                        <ul className="space-y-2">
                                            {otherJobs.map(job => (
                                                <li key={job.id} className="p-2 border rounded-lg hover:bg-gray-50">
                                                    <Link to={`/home/detail/${job.id}`} className="font-semibold text-blue-600 hover:underline">
                                                        {job.judul}
                                                    </Link>
                                                    <p className="text-sm text-gray-500">{job.lokasi}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-sm text-gray-500">Tidak ada lowongan lain yang tersedia saat ini.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ApplyModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                jobTitle={jobData.judul}
                companyName={jobData.perusahaan?.nama_perusahaan}
                companyEmail={companyEmail}
                onShowNotification={handleShowNotification}
            />

            {showNotification && (
                <div className={`fixed top-5 left-1/2 -translate-x-1/2 p-4 rounded-lg shadow-xl font-montserrat text-white z-50 transition-all duration-500 transform ${showNotification ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}
                     ${notificationType === 'success' ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-red-500 to-red-600'}
                     border-2 ${notificationType === 'success' ? 'border-green-700' : 'border-red-700'}
                     flex items-center space-x-2`}
                >
                    {notificationType === 'success' ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    )}
                    <span>{notificationMessage}</span>
                </div>
            )}
            <Footer />
        </>
    );
}

export default JobDetail;