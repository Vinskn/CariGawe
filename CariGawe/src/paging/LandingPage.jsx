import { useEffect, useState } from "react"
import Footer from "../components/Footer"
import JobCard from "../components/JobCard"
import JobCategory from "../components/JobCategory"
import Login from "../components/Login"
import Navbar from "../components/Navbar"
import Signup from "../components/Signup"
import supabase from '../utils/supabaseClient'

function LandingPage({ loginParam }) {
    const [showForm, setShowForm] = useState()
    const [RoleNo, setRoleNo] = useState(0)
    const [jobList, setJobList] = useState([])
    const [jobCategories, setJobCategories] = useState([])

    const handleLogin = () => {
        setShowForm(1)
        setRoleNo(0)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleSignup = () => {
        setShowForm(2)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleLoginCompany = () => {
        setShowForm(1)
        setRoleNo(1)
    }

    const handleCloseForm = () => {
        setShowForm(0)
    }

    useEffect(() => {
        const fetchJobs = async () => {
            const { data, error } = await supabase.from('pekerjaan').select('*')

            if (error) {
                console.log("Gagal mengambil data pekerjaan", error)
            } else {
                setJobList(data)

                const countMap = {}
                data.forEach((job) => {
                    const category = job.kategori || "Lainnya"
                    countMap[category] = (countMap[category] || 0) + 1
                })

                const iconMap = {
                    "Teknologi": "/images/tech.svg",
                    "Desain": "/images/Palette.svg",
                    "Pemasaran": "/images/Marketing.svg",
                    "Administrasi": "/images/admin.svg",
                    "Kesehatan": "/images/health.svg",
                    "Analis": "/images/PieChart.svg",
                    "Teknik": "/images/Gear.svg",
                    "Pemrogram": "/images/Code.svg",
                    "Keuangan": "/images/finance.svg",
                    "Teknisi Listrik": "/images/electric.svg",
                }


                const dynamicCategories = Object.entries(countMap).map(([category, count]) => ({
                    jobTitle: category,
                    jobNo: count,
                    jobIcon: iconMap[category] || "/images/Default.svg",
                }))

                setJobCategories(dynamicCategories)
            }
        }

        fetchJobs()
    }, [])

    return (
        <div className="h-screen">
            {showForm === 1 && <Login closeForm={handleCloseForm} roleNo={RoleNo} toSignup={handleSignup} />}
            {showForm === 2 && <Signup closeForm={handleCloseForm} toLogin={handleLogin} />}

            <Navbar page={1} onLoginClick={handleLogin} onCompLogin={handleLoginCompany} fromPage={0} />

            <div className="m-7 mt-20">
                <div className="bg-[url(/images/background.png)] bg-cover bg-center p-5 rounded-xl h-1/2 flex flex-col items-center">
                    <h1 className="font-baskerville text-4xl text-white text-center font-bold mt-15">
                        Temukan Pekerjaan Menarik & <br /> Cocok untuk Kerja Jarak Jauh
                    </h1>
                    <p className="text-white text-center mt-2 font-montserrat">
                        Jelajahi peluang karier terbaru yang sesuai untukmu. Proses mudah dan cepat.
                    </p>
                    <div className="w-2/3 bg-white flex flex-row p-2 rounded-xl mt-5">
                        <input
                            type="text"
                            placeholder="Keterampilan, Jabatan, Kata Kunci"
                            className="w-1/2 ml-5 font-montserrat border-none focus:outline-none focus:ring-0"
                        />
                        <select className="p-1 focus:outline-none focus:ring-0 mx-3">
                            <option value="#">Kategori Pekerjaan</option>
                        </select>
                        <select className="p-1 focus:outline-none focus:ring-0 mx-3">
                            <option value="#">Pilih Kota</option>
                        </select>
                        <button onClick={handleLogin} className="bg-blue6 px-6 rounded-sm text-white font-bold ml-auto mr-5 hover:bg-blue7">
                            Cari
                        </button>
                    </div>
                </div>

                <div className="mt-10">
                    <h1 className="font-baskerville text-blue7 font-bold text-2xl mt-5">
                        Cari Berdasarkan <span className="text-blue5">Kategori</span>
                    </h1>
                    <div className="grid grid-cols-4 gap-5 mt-5">
                        {jobCategories.map((i, idx) => (
                            <JobCategory
                                key={idx}
                                jobName={i.jobTitle}
                                jobAvail={i.jobNo}
                                jobImg={i.jobIcon}
                            />
                        ))}
                    </div>
                </div>

                <div className="mt-10 bg-gradient-to-tr from-blue6 from-10% to-gradient1 py-20 flex flex-col justify-center items-center">
                    <h1 className="font-baskerville font-bold text-5xl text-white mb-10">Mulai Lamar Pekerjaan Sekarang</h1>
                    <p className="text-white text-center font-montserrat mx-40">
                        Temukan pekerjaan yang sesuai dengan keahlianmu. Cukup daftar dan mulai proses lamar dalam hitungan menit.
                    </p>
                    <button
                        onClick={handleSignup}
                        className="mt-10 bg-white text-blue6 font-bold font-montserrat w-1/6 py-2 rounded-xl hover:bg-gray-300"
                    >
                        Daftar Sekarang
                    </button>
                </div>

                <div className="mt-10">
                    <div className="flex items-center">
                        <h1 className="font-baskerville text-blue7 font-bold text-2xl">
                            Pekerjaan <span className="text-blue5">Unggulan</span>
                        </h1>
                        <a href="#"><img src="images/arrowup.svg" alt="arrowup" className="w-6 mx-5" /></a>
                    </div>

                    <div className="mt-5 grid grid-cols-4 gap-5">
                        {jobList.slice(0, 8).map((i, idx) => (
                            <JobCard
                                key={idx}
                                judul={i.judul}
                                lokasi={i.lokasi}
                                status={i.status}
                                deskripsi_singkat={i.deskripsi_singkat}
                                rating={i.rating}
                                salary={i.salary}
                                tipe_pekerjaan={i.tipe_pekerjaan}
                                actionFunc={handleLogin}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}

export default LandingPage
