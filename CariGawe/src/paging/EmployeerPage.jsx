import { useState, useEffect } from "react";
import Footer from "../components/Footer"
import EmployeeComponent from "../components/EmployeeComponent";
import { AuthUtils } from "../utils/auth";
import EditJobModal from "../components/modals/EditJobModal";
import DeleteConfirmationModal from "../components/modals/DeleteConfirmationModal";
import supabase from '../utils/supabaseClient'
import { useNavigate } from "react-router-dom"; 


function EmployeerPage() {
    const navigate = useNavigate();
    const [menuActive, setMenuActive] = useState(1);
    const [companyData, setCompanyData] = useState(null);
    const [jobsData, setJobsData] = useState([]);
    const [applicantsData, setApplicantsData] = useState([]);
    const [dashboardStats, setDashboardStats] = useState({
        totalJobs: 0,
        activeJobs: 0,
        expiredJobs: 0,
        totalApplicants: 0,
        pendingApplicants: 0
    });
    const [loading, setLoading] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);

    useEffect(() => {
        console.log("Fetching data...");
        fetchCompanyData();
        fetchJobsData();
        fetchApplicantsData();
    }, []);

    const fetchCompanyData = async () => {
        try {
            // Assuming you have user authentication and company ID
            const currentUser = AuthUtils.getCurrentUser();
            if (!currentUser) return;

            const { data, error } = await supabase
                .from('perusahaan')
                .select('*')
                .eq('user_id', currentUser.id || 1) // Fallback to ID 1 if no company_id
                .single();

            if (error) {
                console.error("Error fetching company data:", error);
            } else {
                setCompanyData(data);
            }
        } catch (error) {
            console.error("Error in fetchCompanyData:", error);
        }
    };

    const fetchJobsData = async () => {
        try {
            const currentUser = AuthUtils.getCurrentUser();
            if (!currentUser?.id) return;

            const { data, error } = await supabase
                .from('pekerjaan')
                .select('*')
                .eq('perusahaan_id', currentUser.id) // gunakan ID perusahaan sesuai user
                .order('tanggal_posting', { ascending: false });

            if (error) throw error;
            setJobsData(data || []);

            const now = new Date();
            const totalJobs = data.length;
            const activeJobs = data.filter(job => job.status === 'aktif').length;
            const expiredJobs = data.filter(job => new Date(job.tanggal_berakhir) < now).length;

            setDashboardStats(prev => ({
                ...prev,
                totalJobs,
                activeJobs,
                expiredJobs
            }));
        } catch (error) {
            console.error("Fetch jobs error:", error.message);
        }
    };

    const fetchApplicantsData = async () => {
        try {
            const currentUser = AuthUtils.getCurrentUser();
            
            // Fetch applicants for company's jobs
            let query = supabase
                .from('lamaran')
                .select(`
                    *,
                    pekerjaan(judul, perusahaan_id),
                    pelamar(nama, email)
                `);

            // If user has company_id, filter by company's jobs
            if (currentUser?.company_id) {
                query = query.eq('pekerjaan.perusahaan_id', currentUser.company_id);
            }

            const { data, error } = await query.order('tanggal_lamaran', { ascending: false });

            if (error) {
                console.error("Error fetching applicants:", error);
            } else {
                setApplicantsData(data || []);
                
                const totalApplicants = data?.length || 0;
                const pendingApplicants = data?.filter(applicant => 
                    applicant.status === 'pending' || applicant.status === 'submitted'
                ).length || 0;
                
                setDashboardStats(prev => ({
                    ...prev,
                    totalApplicants,
                    pendingApplicants
                }));
            }
        } catch (error) {
            console.error("Error in fetchApplicantsData:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleJobSubmit = async (jobData) => {
        if ('id' in jobData) {
            console.warn("⚠️ jobData dari form mengandung ID, akan dihapus");
            delete jobData.id;
        }
        try {
            const currentUser = AuthUtils.getCurrentUser();

            const newJobData = {
                judul: jobData.judul,
                deskripsi: jobData.deskripsi,
                syarat: jobData.syarat,
                lokasi: jobData.lokasi,
                kategori: jobData.kategori,
                deskripsi_singkat: jobData.deskripsi_singkat || '',
                salary: parseInt(jobData.salary || 0),
                tipe_pekerjaan: jobData.tipe_pekerjaan,
                syarat_kerja: jobData.syarat_kerja || '',
                status: 'aktif',
                tanggal_posting: jobData.tanggal_posting || new Date().toISOString().split('T')[0],
                perusahaan_id: currentUser?.company_id
            };

            console.log("🧪 final jobData sebelum insert:", newJobData);

            if ('id' in newJobData) {
                console.warn("🚫 Mendeteksi ID di dalam jobData, menghapusnya...");
                delete newJobData.id;
            }

            console.log("Final data to insert:", newJobData);

            const { data, error } = await supabase
                .from('pekerjaan')
                .insert([newJobData])
                .select();

            if (error) {
                console.error("❌ Supabase insert error:", error);
                return { success: false, error };
            }

            await fetchJobsData();
            return { success: true, data };
        } catch (error) {
            console.error("❌ Unexpected error in handleJobSubmit:", error);
            return { success: false, error };
        }
    };

    const handleJobUpdate = async (jobId, updateData) => {
        try {
            const { data, error } = await supabase
                .from('pekerjaan')
                .update(updateData)
                .eq('id', jobId)
                .select();

            if (error) {
                console.error("Error updating job:", error);
                return { success: false, error };
            } else {
                // Refresh jobs data
                await fetchJobsData();
                handleCloseModals();
                return { success: true, data };
            }
        } catch (error) {
            console.error("Error in handleJobUpdate:", error);
            return { success: false, error };
        }
    };

    const handleJobDelete = async (jobId) => {
        try {
            const { error } = await supabase
                .from('pekerjaan')
                .delete()
                .eq('id', jobId);

            if (error) {
                console.error("Error deleting job:", error);
                return { success: false, error };
            } else {
                // Refresh jobs data
                await fetchJobsData();
                handleCloseModals();
                return { success: true };
            }
        } catch (error) {
            console.error("Error in handleJobDelete:", error);
            return { success: false, error };
        }
    };

    const handleApplicantStatusUpdate = async (applicantId, newStatus) => {
        try {
            const { data, error } = await supabase
                .from('lamaran')
                .update({ status: newStatus })
                .eq('id', applicantId)
                .select();

            if (error) {
                console.error("Error updating applicant status:", error);
                return { success: false, error };
            } else {
                // Refresh applicants data
                await fetchApplicantsData();
                return { success: true, data };
            }
        } catch (error) {
            console.error("Error in handleApplicantStatusUpdate:", error);
            return { success: false, error };
        }
    };

    const handleEditClick = (job) => {
        setSelectedJob(job);
        setShowEditModal(true);
    };

    const handleDeleteClick = (job) => {
        setSelectedJob(job);
        setShowDeleteModal(true);
    };
    
    const handleCloseModals = () => {
        setShowEditModal(false);
        setShowDeleteModal(false);
        setSelectedJob(null);
    };

    const handleLogout = () => { // New handleLogout function
        AuthUtils.logout(); // Call the logout utility function
        navigate('/'); // Redirect to the landing page or login page
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-gray-500">Loading...</div>
            </div>
        );
    }
    
    return (
        <>
            <div className="flex gap-3 w-full">
                {/* sidebar */}
                <div className="w-1/5 border-r border-gray-300 p-7">
                    <h1 className="font-baskerville text-3xl font-bold text-blue7">CariGawe</h1>
                    <ul className="list-[square] list-inside flex flex-col gap-3 font-montserrat mt-5">
                        <li onClick={() => setMenuActive(1)} className={`${menuActive == 1 ? "bg-blue7 py-1 px-2 text-white font-bold rounded-lg" : "text-gray-500"} cursor-pointer select-none`}>
                            Dashboard
                        </li>
                        <li onClick={() => setMenuActive(2)} className={`${menuActive == 2 ? "bg-blue7 py-1 px-2 text-white font-bold rounded-lg" : "text-gray-500"} cursor-pointer select-none`}>
                            Pelamar
                        </li>
                        <li onClick={() => setMenuActive(3)} className={`${menuActive == 3 ? "bg-blue7 py-1 px-1 text-white font-bold rounded-lg text-sm" : "text-gray-500"} cursor-pointer select-none`}>
                            Lowongan Pekerjaan
                        </li>
                        <li onClick={() => setMenuActive(4)} className={`${menuActive == 4 ? "bg-blue7 py-1 px-2 text-white font-bold rounded-lg" : "text-gray-500"} cursor-pointer select-none`}>
                            Pasang Loker
                        </li>
                        <li onClick={handleLogout} className="text-gray-500 cursor-pointer select-none"> {/* Attach handleLogout */}
                            Logout
                        </li>
                    </ul>
                </div>


                <div className="w-4/5">
                    <h1 className="font-baskerville text-2xl text-blue7 m-7 mb-0">Google</h1>
                    <EmployeeComponent>
                        {menuActive == 1 ? <EmployeeComponent.Dashboard jobs={jobsData} onEdit={handleEditClick} onDelete={handleDeleteClick} dashboardStats={dashboardStats} /> : ""}
                        {menuActive == 2 ? <EmployeeComponent.Pelamar/> : ""}
                        {menuActive == 3 ? <EmployeeComponent.Lowongan jobs={jobsData} onEdit={handleEditClick} onDelete={handleDeleteClick} dashboardStats={dashboardStats}/> : ""}
                        {menuActive == 4 ? <EmployeeComponent.PasangLoker onSubmit={handleJobSubmit}/> : ""}
                    </EmployeeComponent>

                </div>
            </div>

            <EditJobModal
                isOpen={showEditModal}
                onClose={handleCloseModals}
                job={selectedJob}
                onSave={handleJobUpdate}
            />

            <DeleteConfirmationModal
                isOpen={showDeleteModal}
                onClose={handleCloseModals}
                onConfirm={() => handleJobDelete(selectedJob.id)}
            />

            <Footer/>
        </>
    )
}

export default EmployeerPage;