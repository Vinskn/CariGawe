import { useState } from "react";
import EmployeeCards from "./EmployeeCards";

function EmployeeComponent({ children }) {
    return(
        <div className="p-7">
            {children}
        </div>
    )
}

function Dashboard({ jobs, onEdit, onDelete, dashboardStats }){
    return(
        <>
            {/* topbar */}
            <div className="flex justify-between gap-3 mb-10">
                <div className="grid grid-cols-2 grid-rows-2 gap-y-0 items-center py-2 px-10 rounded-xl border-gray-300 border-r-2 border-b-2">
                    <h1 className="text-4xl font-montserrat font-bold text-blue7 mb-0">{dashboardStats.totalJobs}</h1>
                    <img src="/images/Bag.svg" className="row-span-2 w-15 ml-8 self-center" />
                    <h1 className="font-montserrat font-bold text-sm mt-0">Posted Job</h1>
                </div>
                <div className="grid grid-cols-2 grid-rows-2 gap-y-0 items-center py-2 px-10 rounded-xl border-gray-300 border-r-2 border-b-2">
                    <h1 className="text-4xl font-montserrat font-bold text-blue7 mb-0">{dashboardStats.pendingAplicants} 0</h1>
                    <img src="/images/Bookmark.svg" className="row-span-2 w-15 ml-8 self-center" />
                    <h1 className="font-montserrat font-bold text-sm mt-0">Shortlisted</h1>
                </div>
                    <div className="grid grid-cols-2 grid-rows-2 gap-y-0 items-center py-2 px-10 rounded-xl border-gray-300 border-r-2 border-b-2">
                    <h1 className="text-4xl font-montserrat font-bold text-blue7 mb-0">{dashboardStats.totalAplicants} 0</h1>
                    <img src="/images/Social.svg" className="row-span-2 w-15 ml-8 self-center" />
                    <h1 className="font-montserrat font-bold text-sm mt-0">Application</h1>
                </div>
                <div className="grid grid-cols-2 grid-rows-2 gap-y-0 items-center py-2 px-2 rounded-xl border-gray-300 border-r-2 border-b-2">
                    <h1 className="text-4xl font-montserrat font-bold text-blue7 mb-0">0</h1>
                    <img src="/images/Pen.svg" className="row-span-2 w-15 ml-8 self-center" />
                    <h1 className="font-montserrat font-bold text-sm w-30 mt-0">Save Candidate</h1>
                </div>
            </div>

            <h1 className="font-baskerville text-blue6">Upgrade Package - 10 Days Left</h1>
            <div className=" h-screen overflow-y-auto">
                {jobs && jobs.length > 0 ? (
                    jobs.map(job => (
                        <EmployeeCards.DashboardCard 
                            key={job.id} 
                            job={job}
                            onEditClick={() => onEdit(job)}
                            onDeleteClick={() => onDelete(job)}
                        />
                    ))
                ) : (
                    <p className="text-center text-gray-500 mt-10">Belum ada lowongan yang diposting.</p>
                )}
            </div>
        </>
    )
}

function Pelamar(){
    const [filterActive, setFilterActive] = useState(1);
    return (
        <>
            <div className="flex justify-between bg-[url(/images/background.png)] bg-bottom-right p-5 py-10 rounded-lg font-montserrat">
                <div className="relative w-1/2 bg-white rounded-lg flex items-center shadow-xl">
                    <input type="text" id="search" placeholder="Judul Pekerjaan, Kata Kunci, dll" className="w-9/10 px-2 py-2 focus:outline-none"/>
                    <button className="absolute right-0 mx-5 bg-blue7 px-3 py-1 rounded-lg text-white text-sm">Cari</button>
                </div>
                <select id="Sorting" className="bg-white px-2 text-sm text-gray-500">
                    <option value="default">Sort by (Default)</option>
                </select>
            </div>

            <div className="mt-10 flex justify-between">
                <h1 className="font-baskerville text-xl text-blue7">Sr. Magento Developer</h1>
                <div className="flex gap-5">
                    <h1 className={`${filterActive == 1 ? "bg-blue7 text-white font-bold" : "bg-gray-200"} py-1 px-3 rounded-lg select-none cursor-default`}
                        onClick={() => setFilterActive(1)}>
                        All: 194
                    </h1>
                    <h1 className={`${filterActive == 2 ? "bg-blue7 text-white font-bold" : "bg-gray-200"} py-1 px-3 rounded-lg select-none cursor-default`}
                        onClick={() => setFilterActive(2)}>
                        Approved: 294
                    </h1>
                    <h1 className={`${filterActive == 3 ? "bg-blue7 text-white font-bold" : "bg-gray-200"} py-1 px-3 rounded-lg select-none cursor-default`}
                        onClick={() => setFilterActive(3)}>
                        Rejected: 204
                    </h1>
                </div>
            </div>

            <div className="mt-5 h-screen overflow-y-auto">
                <EmployeeCards.PelamarCard/>
                <EmployeeCards.PelamarCard/>
                <EmployeeCards.PelamarCard/>
                <EmployeeCards.PelamarCard/>
                <EmployeeCards.PelamarCard/>
                <EmployeeCards.PelamarCard/>
                <EmployeeCards.PelamarCard/>
                <EmployeeCards.PelamarCard/>
            </div>
        </>
    )
}

function Lowongan({ jobs, onEdit, onDelete, dashboardStats }){
    const [filterActive, setFilterActive] = useState(1);
    return(
        <>
            <div className="flex justify-between bg-[url(/images/background.png)] bg-bottom-right p-5 py-10 rounded-lg font-montserrat">
                <div className="relative w-1/2 bg-white rounded-lg flex items-center shadow-xl">
                    <input type="text" id="search" placeholder="Judul Pekerjaan, Kata Kunci, dll" className="w-9/10 px-2 py-2 focus:outline-none"/>
                    <button className="absolute right-0 mx-5 bg-blue7 px-3 py-1 rounded-lg text-white text-sm">Cari</button>
                </div>
                <select id="Sorting" className="bg-white px-2 text-sm text-gray-500">
                    <option value="default">Sort by (Default)</option>
                </select>
            </div>

            <div className="mt-10 flex justify-between">
                <h1 className="font-baskerville text-xl text-blue7">Upgrade Package - 10 Days Left</h1>
                <div className="flex gap-5">
                    <h1 className={`${filterActive == 1 ? "bg-blue7 text-white font-bold" : "bg-gray-200"} py-1 px-3 rounded-lg select-none cursor-default`}
                        onClick={() => setFilterActive(1)}>
                        All: {dashboardStats.totalJobs}
                    </h1>
                    <h1 className={`${filterActive == 2 ? "bg-blue7 text-white font-bold" : "bg-gray-200"} py-1 px-3 rounded-lg select-none cursor-default`}
                        onClick={() => setFilterActive(2)}>
                        Active: {dashboardStats.activeJobs}
                    </h1>
                    <h1 className={`${filterActive == 3 ? "bg-blue7 text-white font-bold" : "bg-gray-200"} py-1 px-3 rounded-lg select-none cursor-default`}
                        onClick={() => setFilterActive(3)}>
                        Expired: {dashboardStats.expiredJobs}
                    </h1>
                </div>
            </div>
            <div className=" h-screen overflow-y-auto">
                {jobs && jobs.length > 0 ? (
                    jobs
                        .filter(job => {
                            const now = new Date();
                            if (filterActive === 2) {
                                return job.status?.toLowerCase() === 'aktif';
                            } else if (filterActive === 3) {
                                return new Date(job.tanggal_berakhir) < now;
                            }
                            return true;
                        })
                        .map(job => (
                            <EmployeeCards.DashboardCard 
                                key={job.id} 
                                job={job}
                                onEditClick={() => onEdit(job)}
                                onDeleteClick={() => onDelete(job)}
                            />
                        ))
                ) : (
                    <p className="text-center text-gray-500 mt-10">Belum ada lowongan.</p>
                )}
            </div>
        </>
    )
}

function PasangLoker({ onSubmit }){
    const [formData, setFormData] = useState({
        judul: '',
        deskripsi: '',
        syarat: '',
        alamat: '',
        kategori: 'Teknik',
        deskSingkat: '',
        salary: '',
        tipe: 'Full-Time',
        syarat_kerja: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        const now = new Date();
        const jobData = {
            judul: formData.judul,
            deskripsi: formData.deskripsi,
            syarat: formData.syarat,
            lokasi: formData.alamat,
            kategori: formData.kategori,
            tanggal_posting: now.toISOString().split('T')[0],
            status: 'aktif',
            deskripsi_singkat: formData.deskSingkat,
            salary: parseInt(formData.gaji || 0),
            tipe_pekerjaan: formData.tipe,
            syarat_kerja: formData.kualifikasi
        };

        const result = await onSubmit(jobData);
        if (result.success) {
            alert("Lowongan berhasil diposting!");
            // reset form jika perlu
        } else {
            alert("Gagal menyimpan data");
        }
    };

    return(
        <>
            <div className="flex flex-col items-center gap-3">
                <img src="/images/google.svg" className="w-20"/>
                <button className="bg-blue7 hover:bg-blue6 py-1 px-5 rounded-lg text-white font-montserrat">Logo Perusahaan</button>
            </div>

            <div className="flex flex-col text-gray-500">
                <label htmlFor="namaPekerjaan">Nama Pekerjaan</label>
                <input type="text" id="namaPekerjaan" name="judul" value={formData.judul}  onChange={handleChange} className="border-1 border-gray-300 rounded-lg py-2 px-1 focus:outline-none mr-5 mb-3"/>
                
                <label htmlFor="descJob">Deskripsi Pekerjaan</label>
                <textarea id="descJob" cols="30" name="deskripsi" value={formData.deskripsi}  onChange={handleChange} className="border-1 border-gray-300 rounded-lg py-2 px-1 focus:outline-none mr-5 mb-3 h-40"/>
                
                <label htmlFor="syarat">Persyaratan</label>
                <textarea id="syarat" cols="30" name="syarat" value={formData.syarat}  onChange={handleChange} className="border-1 border-gray-300 rounded-lg py-2 px-1 focus:outline-none mr-5 mb-3 h-60"/>
                
                <label htmlFor="syarat_kerja">Kualifikasi dan Keterampilan</label>
                <textarea id="syarat_kerja" cols="30" name="syarat_kerja" value={formData.syarat_kerja}  onChange={handleChange} className="border-1 border-gray-300 rounded-lg py-2 px-1 focus:outline-none mr-5 mb-3 h-60"/>
                
                <label htmlFor="namaPekerjaan">Alamat</label>
                <textarea id="descJob" cols="30" name="alamat" value={formData.lokasi}  onChange={handleChange} className="border-1 border-gray-300 rounded-lg py-2 px-1 focus:outline-none mr-5 mb-3 h-15"/>
{/*                 
                <div className="flex justify-between mb-3">
                    <div className="flex flex-col w-1/2">
                        <label htmlFor="negara">Negara</label>
                        <select id="negara" name="negara" className="bg-white w-4/5 border border-gray-300 py-2 px-1 rounded-xl focus:outline-none">
                            <option value="Indonesia">Indonesia</option>
                        </select>
                    </div>
                    <div className="flex flex-col w-1/2">
                        <label htmlFor="kota">Kota</label>
                        <select id="kota" name="kota" className="bg-white w-4/5 border border-gray-300 py-2 px-1 rounded-xl focus:outline-none">
                            <option value="Bandung">Bandung</option>
                        </select>
                    </div>
                </div> */}

                <div className="flex justify-between mb-3">
                    <div className="flex flex-col w-full">
                        <label htmlFor="kategori">Kategori</label>
                        <select id="kategori" name="kategori" className="bg-white w-4/5 border border-gray-300 py-2 px-1 rounded-xl focus:outline-none">
                            <option value="Teknik">Teknik</option>
                            <option value="Desain">Desain</option>
                            <option value="Analisis">Analisis</option>
                            <option value="Pemasaran">Pemasaran</option>
                        </select>
                    </div>
                    <div className="flex flex-col w-full">
                        <label htmlFor="maxGaji">Gaji</label>
                        <input type="number" name="salary" id="maxGaji" value={formData.salary}  onChange={handleChange} className="bg-white w-4/5 border border-gray-300 py-2 px-1 rounded-xl focus:outline-none"/>
                    </div>
                </div>

                <div className="flex justify-between mb-3">
                    <div className="flex flex-col w-full">
                        <label htmlFor="deskSingkat">Deskripsi Singkat</label>
                        <input type="text" name="deskSingkat" id="deskSingkat" value={formData.deskSingkat}  onChange={handleChange} className="bg-white w-4/5 border border-gray-300 py-2 px-1 rounded-xl focus:outline-none"/>
                    </div>
                    <div className="flex flex-col w-full">
                        <label htmlFor="tipe">Tipe Pekerjaan</label>
                        <select id="tipe" name="tipe" className="bg-white w-4/5 border border-gray-300 py-2 px-1 rounded-xl focus:outline-none">
                            <option value="Full-Time">Full Time</option>
                            <option value="Part-Time">Part Time</option>
                            <option value="Kontrak">Kontrak</option>
                            <option value="Freelance">Freelance</option>
                            <option value="Magang">Magang</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="w-full flex justify-center mb-10 mt-20">
                <button onClick={handleSubmit} className="font-montserrat bg-blue7 hover:bg-blue6 text-white rounded-lg py-2 px-5 font-bold">
                    SIMPAN DAN LIHAT
                </button>
            </div>
        </>
    )
}

EmployeeComponent.Pelamar = Pelamar;
EmployeeComponent.Dashboard = Dashboard;
EmployeeComponent.Lowongan = Lowongan;
EmployeeComponent.PasangLoker = PasangLoker;
export default EmployeeComponent;