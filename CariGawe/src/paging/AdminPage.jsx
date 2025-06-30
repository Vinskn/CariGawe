import { useState } from "react";
import AdminComponents from "../components/AdminComponents";
import supabase from '../utils/supabaseClient'

function AdminPage({  }) {
    const [menuActive, setMenuActive] = useState(1);
    const [filterActive, setFilterActive] = useState(1);
    const [jobList, setJobList] = useState([]);
    const [counts, setCounts] = useState({
        all: 0,
        active: 0,
        expired: 0
    });
    const [loading, setLoading] = useState(true);
    const [searchKeyword, setSearchKeyword] = useState("");

    //Fetch job counts and data
    useEffect(() => {
        fetchJobData();
    }, [filterActive, searchKeyword]);

    const fetchJobData = async () => {
        setLoading(true);
        try {
            // Build query based on filter
            let query = supabase
                .from('pekerjaan')
                .select('*, perusahaan(nama_perusahaan)');

            // Apply search filter if keyword exists
            if (searchKeyword) {
                query = query.ilike('judul', `%${searchKeyword}%`);
            }

            // Apply status filter
            if (filterActive === 2) {
                query = query.eq('status', 'active');
            } else if (filterActive === 3) {
                query = query.eq('status', 'expired');
            }

            const { data: jobs, error } = await query.order('created_at', { ascending: false });

            if (error) {
                console.error("Error fetching jobs:", error);
            } else {
                setJobList(jobs || []);
            }

            // Fetch counts for filter buttons
            await fetchCounts();

        } catch (error) {
            console.error("Error in fetchJobData:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCounts = async () => {
        try {
            // Get all jobs count
            const { count: allCount, error: allError } = await supabase
                .from('pekerjaan')
                .select('*', { count: 'exact', head: true });

            // Get active jobs count
            const { count: activeCount, error: activeError } = await supabase
                .from('pekerjaan')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'active');

            // Get expired jobs count
            const { count: expiredCount, error: expiredError } = await supabase
                .from('pekerjaan')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'expired');

            if (!allError && !activeError && !expiredError) {
                setCounts({
                    all: allCount || 0,
                    active: activeCount || 0,
                    expired: expiredCount || 0
                });
            }
        } catch (error) {
            console.error("Error fetching counts:", error);
        }
    };

    const handleSearch = (e) => {
        if (e.key === 'Enter' || e.type === 'click') {
            const keyword = e.target.type === 'button' ? 
                document.getElementById('search').value : 
                e.target.value;
            setSearchKeyword(keyword);
        }
    };

    const handleSorting = (e) => {
        const sortValue = e.target.value;
        let sortedJobs = [...jobList];

        switch (sortValue) {
            case 'newest':
                sortedJobs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                break;
            case 'oldest':
                sortedJobs.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
                break;
            case 'salary_high':
                sortedJobs.sort((a, b) => (b.salary || 0) - (a.salary || 0));
                break;
            case 'salary_low':
                sortedJobs.sort((a, b) => (a.salary || 0) - (b.salary || 0));
                break;
            default:
                break;
        }

        setJobList(sortedJobs);
    };   

    return (
        <>
            <div className="flex gap-3 w-full">
                <div className="w-1/5 border-r border-gray-300 p-7">
                    <h1 className="font-baskerville text-3xl font-bold text-blue7">CariGawe</h1>
                    <ul className="list-[square] list-inside flex flex-col gap-3 font-montserrat mt-5">
                        <li onClick={() => setMenuActive(1)} className={`${menuActive == 1 ? "bg-blue7 py-1 px-2 text-white font-bold rounded-lg" : "text-gray-500"} cursor-pointer select-none`}>
                            Dashboard
                        </li>
                    </ul>
                </div>

                <div className="w-4/5 m-7">
                    <h1 className="font-baskerville text-blue6 text-xl mb-3">Google</h1>
                    <div className="flex justify-between bg-[url(/images/background.png)] bg-bottom-right p-5 py-10 rounded-lg font-montserrat">
                        <div className="relative w-1/2 bg-white rounded-lg flex items-center shadow-xl">
                            <input type="text" id="search" placeholder="Judul Pekerjaan, Kata Kunci, dll" className="w-9/10 px-2 py-2 focus:outline-none"/>
                            <button className="absolute right-0 mx-5 bg-blue7 px-3 py-1 rounded-lg text-white text-sm">Cari</button>
                        </div>
                        <select id="Sorting" className="bg-white px-2 text-sm text-gray-500 rounded-lg">
                            <option value="default">Sort by (Default)</option>
                        </select>
                    </div>
                    <div className="mt-10 flex justify-between">
                        <h1 className="font-baskerville text-xl text-blue7">Upgrade Package - 10 Days Left</h1>
                        <div className="flex gap-5">
                            <h1 className={`${filterActive == 1 ? "bg-blue7 text-white font-bold" : "bg-gray-200"} py-1 px-3 rounded-lg select-none cursor-default`}
                                onClick={() => setFilterActive(1)}>
                                All: 194
                            </h1>
                            <h1 className={`${filterActive == 2 ? "bg-blue7 text-white font-bold" : "bg-gray-200"} py-1 px-3 rounded-lg select-none cursor-default`}
                                onClick={() => setFilterActive(2)}>
                                Active: 294
                            </h1>
                            <h1 className={`${filterActive == 3 ? "bg-blue7 text-white font-bold" : "bg-gray-200"} py-1 px-3 rounded-lg select-none cursor-default`}
                                onClick={() => setFilterActive(3)}>
                                Expired: 204
                            </h1>
                        </div>
                    </div>
                    <div className=" h-screen overflow-y-auto">
                        <AdminComponents.DashboardCard/>
                        <AdminComponents.DashboardCard/>
                        <AdminComponents.DashboardCard/>
                        <AdminComponents.DashboardCard/>
                    </div>
                </div>
            </div>

            
        </>
    )
}

export default AdminPage;