import { useEffect, useRef, useState } from "react";
import Footer from "../components/Footer";
import JobCard from "../components/JobCard";
import JobCategory from "../components/JobCategory";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import supabase from '../utils/supabaseClient';

function Home() {
    const [filteredSearch, setFilteredSearch] = useState(false);
    const [filteredJobs, setFilteredJobs] = useState(null);
    const [jobList, setJobList] = useState([]);
    const [jobCategories, setJobCategories] = useState([]);
    const dataRefs = useRef([]);
    const navigate = useNavigate();

    const handleSearch = () => {
        setFilteredSearch(true);
        const keyword = dataRefs.current[0].value;
        const jobType = dataRefs.current[1].value;
        const city = dataRefs.current[2].value;

        const filters = { keyword, jobType, city, kategori: '' };
        setFilteredJobs(filters);
        window.scrollTo({ top: 600, behavior: 'smooth' });
    };

    useEffect(() => {
        const fetchCategories = async () => {
            const { data, error } = await supabase.from('pekerjaan').select('kategori');
            if (error) {
                console.error("Failed to fetch category data:", error);
            } else {
                const countMap = {};
                data.forEach((job) => {
                    const category = job.kategori || "Lainnya";
                    countMap[category] = (countMap[category] || 0) + 1;
                });
                const iconMap = {
                    "Teknologi": "/images/tech.svg",
                    "Desain": "/images/Palette.svg",
                    "Pemasaran": "/images/Marketing.svg",
                    "Analis": "/images/PieChart.svg",
                    "Teknik": "/images/Gear.svg",
                    "Pemrogram": "/images/Code.svg",
                    "Keuangan": "/images/finance.svg",
                    "Teknisi Listrik": "/images/electric.svg",
                };
                const dynamicCategories = Object.entries(countMap).map(([category, count]) => ({
                    jobTitle: category,
                    jobNo: count,
                    jobIcon: iconMap[category] || "/images/Default.svg",
                }));
                setJobCategories(dynamicCategories);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchJobs = async () => {
            let query = supabase.from('pekerjaan').select('*');

            if (filteredJobs) {
                if (filteredJobs.kategori) {
                    query = query.eq('kategori', filteredJobs.kategori);
                }
                if (filteredJobs.keyword) {
                    query = query.ilike('judul', `%${filteredJobs.keyword}%`);
                }
                if (filteredJobs.jobType) {
                    query = query.ilike('tipe_pekerjaan', filteredJobs.jobType);
                }
                if (filteredJobs.city) {
                    query = query.ilike('lokasi', filteredJobs.city);
                }
            }

            const { data, error } = await query;

            if (error) {
                console.error("Failed to fetch job data:", error);
            } else {
                setJobList(data);
            }
        };

        fetchJobs();
    }, [filteredJobs]);
    
    const handleSelectJob = (id) => {
        navigate(`detail/${id}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="h-screen">
            <Navbar fromPage={1} />
            <div className="m-7 mt-20">
                <div className="bg-[url(/images/background.png)] bg-cover bg-center p-5 rounded-xl h-1/2 flex flex-col items-center">
                    <h1 className="font-baskerville text-4xl text-white text-center font-bold mt-15">Temukan Pekerjaan Hebat & <br /> Ramah untuk Kerja Jarak Jauh</h1>
                    <p className="text-white text-center mt-2 font-montserrat">Temukan peluang karier Anda berikutnya dengan mudah. Jelajahi lowongan kerja terbaru yang dirancang untuk Anda.</p>
                    <div className="w-2/3 bg-white flex flex-row p-2 rounded-xl mt-5">
                        <input ref={(elm) => (dataRefs.current[0] = elm)} type="text" placeholder="Nama Pekerjaan, Posisi, Jabatan" className="w-1/2 ml-5 font-montserrat border-none focus:outline-none focus:ring-0 " />
                        <select ref={(elm) => (dataRefs.current[1] = elm)} name="#" id="#" className="p-1 focus:outline-none focus:ring-0 mx-3">
                            <option value="">Tipe Pekerjaan</option>
                            <option value="Freelancer">Freelancer</option>
                            <option value="full time">Full Time</option>
                            <option value="part time">Part Time</option>
                        </select>
                        <select ref={(elm) => (dataRefs.current[2] = elm)} name="#" id="#" className="p-1 focus:outline-none focus:ring-0 mx-3">
                            <option value="">Pilih Kota</option>
                            <option value="bandung">Bandung</option>
                            <option value="jakarta">Jakarta</option>
                        </select>
                        <button onClick={handleSearch} className="bg-blue6 px-6 rounded-sm text-white font-bold ml-auto mr-5 hover:bg-blue7">Cari</button>
                    </div>
                </div>

                <div className="mt-10">
                    <h1 className="font-baskerville text-blue7 font-bold text-2xl mt-5">Jelajahi Berdasarkan <span className="text-blue5">Kategori</span></h1>
                    <div className="grid grid-cols-4 gap-5 mt-5">
                        {jobCategories.map((i, idx) => (
                            <JobCategory
                                key={idx}
                                jobName={i.jobTitle}
                                jobAvail={i.jobNo}
                                jobImg={i.jobIcon}
                                toFilter={setFilteredJobs}
                            />
                        ))}
                    </div>
                </div>

                <div className="mt-10">
                    <div className="flex items-center">
                        <h1 className="font-baskerville text-blue7 font-bold text-2xl">
                            {filteredSearch ? (<>Hasil Pencarian <span className="text-blue5">Pekerjaan</span></>) : (<>Pekerjaan <span className="text-blue5">Unggulan</span></>)}
                        </h1>
                    </div>
                    <div className="mt-5 grid grid-cols-4 gap-5">
                        {jobList.slice(0, 8).map((i, idx) => (
                            <JobCard
                                key={idx}
                                job_id={i.id}
                                judul={i.judul}
                                lokasi={i.lokasi}
                                status={i.status}
                                deskripsi_singkat={i.deskripsi_singkat}
                                rating={i.rating}
                                salary={i.salary}
                                tipe_pekerjaan={i.tipe_pekerjaan}
                                actionFunc={handleSelectJob}
                            />
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Home;