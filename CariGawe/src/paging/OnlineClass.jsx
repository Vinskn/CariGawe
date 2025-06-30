import { useEffect, useRef, useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import OnlineClassComponent from "../components/OnlineClassComponent";
import { useNavigate } from "react-router-dom";
import supabase from '../utils/supabaseClient';

function OnlineClass() {
    const [classList, setClassList] = useState([]);
    const [filteredClass, setFilteredSearch] = useState("");
  
    const navigate = useNavigate();
    const inputSearch = useRef();

    // --- Start of Pagination and Loading State ---
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    const itemsPerPage = 8; // Display 8 classes per page in a 4-column grid
    // --- End of Pagination and Loading State ---

    const handleSearch = () => {
        let keyword = inputSearch.current?.value || "";

        setCurrentPage(1); // Reset to first page on new search
        setFilteredSearch(keyword)
    }

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const keyword = filteredClass;
          
            // --- Pagination Logic ---
            const from = (currentPage - 1) * itemsPerPage;
            const to = from + itemsPerPage - 1;

            let query = supabase
                .from('materi')
                .select('*', { count: 'exact' }); // Get total count for pagination

            if (keyword !== "") {
                query = query.or(
                    `judul.ilike.%${keyword}%,kategori.ilike.%${keyword}%,author.ilike.%${keyword}%`
                );
            }
            
            // Add range for pagination
            query = query.range(from, to);

            const { data, error, count } = await query;
            if (error) {
                console.log("Err; Fetching class data", error);
                setClassList([]);
            } else {
                setClassList(data);
                setTotalResults(count); // Set total results from the query count
            }
            setIsLoading(false);
        };

        fetchData();
    }, [filteredClass, currentPage]); // Add currentPage as a dependency

    const handleClassClick = (id) => {
        navigate(`detail/${id}`);
        window.scrollTo({top: 0, behavior: 'smooth'})
    }
    
    // --- Calculate total pages ---
    const totalPages = Math.ceil(totalResults / itemsPerPage);


    return(
        <>
            <Navbar fromPage={1}/>
            <div className="m-7 mt-20">
                <div className="bg-[url(/images/background-kelasonline.png)] rounded-3xl p-5 py-15 flex flex-col items-center justify-center mb-10">
                    <h1 className="text-white text-3xl font-baskerville mb-2 font-bold">Terus Berkembang di Mana Saja, Kapan Saja!</h1>
                    <p className="text-white font-montserrat">Pilih kelas online terbaik untuk pengembangan diri serta kariermu dan uji kemampuanmu</p>
                    <div className="relative w-7/10 bg-white rounded-lg flex items-center shadow-xl mt-5">
                        <input ref={inputSearch} type="text" id="search" placeholder="Judul, author, kategori, tags" className="w-9/10 px-2 py-3 focus:outline-none"/>
                        <button onClick={() => handleSearch()} className="absolute right-0 mx-5 bg-blue7 hover:bg-blue6 px-8 py-1 rounded-lg text-white text-sm">Cari</button>
                    </div>
                </div>

                <div className="mt-5">
                    <h1 className="font-baskerville text-blue7 font-bold text-2xl">Jelajahi <span className="text-blue5">Kelas</span></h1>
                    <p className="text-gray-600 my-4">Showing {classList.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}–{Math.min(currentPage * itemsPerPage, totalResults)} of {totalResults} Results</p>

                    {isLoading ? (
                         <div className="text-center p-10">
                            <p>Loading...</p>
                        </div>
                    ) : classList.length === 0 ? (
                        <div className="text-center p-10">
                            <p>No classes found. Try a different search term.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-4 gap-3 mt-5">
                            {
                                classList.map((i, idx) => (
                                    <OnlineClassComponent.MaterialCard 
                                        key={idx}
                                        id={i.id}
                                        judul={i.judul}
                                        author={i.author}
                                        actionFunc={handleClassClick}
                                    />
                                ))
                            }
                        </div>
                    )}
                </div>

                {/* --- Pagination Controls --- */}
                <div className="flex justify-center items-center mt-10">
                    <nav className="flex items-center space-x-2">
                        {totalPages > 1 && (
                            <>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1 || isLoading}
                                    className="px-3 py-2 border rounded-md bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                                </button>

                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button 
                                    key={page} 
                                    onClick={() => setCurrentPage(page)}
                                    className={`px-4 py-2 border rounded-md ${currentPage === page ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                                    disabled={isLoading}
                                >
                                    {page}
                                </button>
                                ))}

                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages || isLoading}
                                    className="px-3 py-2 border rounded-md bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                                </button>
                            </>
                        )}
                    </nav>
                </div>
            </div>
            <Footer/>
        </>
    );
}

export default OnlineClass;