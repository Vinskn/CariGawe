import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import JobCard from '../components/JobCard';
import supabase from '../utils/supabaseClient';

function Lowongan() {
  const [jobList, setJobList] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const searchRefs = useRef([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const itemsPerPage = 20;

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);

      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;

      let query = supabase
        .from('active_job_listings')
        .select('*', { count: 'exact' })
        .order('pekerjaan_id', { ascending: false });

      if (filteredJobs) {
        if (filteredJobs.keyword) {
          query = query.ilike('job_title', `%${filteredJobs.keyword}%`);
        }
        if (filteredJobs.category) {
          query = query.eq('job_category', filteredJobs.category);
        }
        if (filteredJobs.city) {
          query = query.ilike('job_location', `%${filteredJobs.city}%`);
        }
      }

      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) {
        console.error('Error fetching jobs:', error);
        setJobList([]);
      } else {
        setJobList(data);
        setTotalResults(count);
      }
      setIsLoading(false);
    };

    fetchJobs();
  }, [filteredJobs, currentPage]);

  const handleSelectJob = (id) => {
    navigate(`/home/detail/${id}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    const filters = {
      keyword: searchRefs.current[0].value,
      category: searchRefs.current[1].value,
      city: searchRefs.current[2].value
    };
    setFilteredJobs(filters);
  };

  const totalPages = Math.ceil(totalResults / itemsPerPage);

  return (
    <div className="bg-slate-50">
      <Navbar />
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 pt-28">
        <div
          className="bg-cover bg-center p-5 rounded-xl shadow-md mb-8 flex flex-col items-center"
          style={{ backgroundImage: "url('/images/background.png')" }}
        >
          <form onSubmit={handleSearchSubmit} className="w-full max-w-5xl bg-white flex flex-row p-2 rounded-xl mt-5">
            <input
              type="text"
              ref={(el) => (searchRefs.current[0] = el)}
              placeholder="Nama Pekerjaan, Posisi, Jabatan"
              className="flex-grow ml-5 font-montserrat border-none focus:outline-none focus:ring-0"
            />
            <select
              ref={(el) => (searchRefs.current[1] = el)}
              className="p-1 focus:outline-none focus:ring-0 mx-3 font-montserrat"
            >
              <option value="">Kategori</option>
              <option value="Teknologi">Teknologi</option>
              <option value="Pemasaran">Pemasaran</option>
              <option value="Kreatif">Kreatif</option>
              <option value="Keuangan">Keuangan</option>
              <option value="Kesehatan">Kesehatan</option>
              <option value="Pendidikan">Pendidikan</option>
              <option value="Teknik">Teknik</option>
            </select>
            <select
              ref={(el) => (searchRefs.current[2] = el)}
              className="p-1 focus:outline-none focus:ring-0 mx-3 font-montserrat"
            >
              <option value="">Pilih Kota</option>
              <option value="Jakarta">Jakarta</option>
              <option value="Bandung">Bandung</option>
              <option value="Surabaya">Surabaya</option>
            </select>
            <button
              type="submit"
              className="bg-blue6 px-6 rounded-md text-white font-bold ml-auto mr-5 hover:bg-blue7"
            >
              Search
            </button>
          </form>
        </div>

        <div>
          <p className="text-gray-600 mb-6">Showing {jobList.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}–{Math.min(currentPage * itemsPerPage, totalResults)} of {totalResults} Results</p>

          {isLoading ? (
            <div className="text-center p-10">
              <p>Loading...</p>
            </div>
          ) : jobList.length === 0 ? (
            <div className="text-center p-10">
              <p>No jobs found. Try adjusting your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {jobList.map((job) => (
                <JobCard
                  key={job.pekerjaan_id}
                  job_id={job.pekerjaan_id}
                  judul={job.job_title}
                  lokasi={job.job_location}
                  status={job.status}
                  deskripsi_singkat={job.deskripsi_singkat}
                  rating={job.rating}
                  salary={job.salary}
                  tipe_pekerjaan={job.tipe_pekerjaan}
                  compLogo={job.compLogo}
                  actionFunc={handleSelectJob}
                />
              ))}
            </div>
          )}
        </div>

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
      </main>
      <Footer />
    </div>
  );
}

export default Lowongan;