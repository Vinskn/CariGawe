import { useEffect, useState } from 'react';
import LandingPage from './paging/LandingPage';
import supabase from './utils/supabaseClient';

function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const tableMapping = {
    hasilTes: 'hasil_tes',
    lamaran: 'lamaran',
    materi: 'materi',
    pekerjaan: 'pekerjaan',
    pelamar: 'pelamar',
    pengalaman_kerja: 'pengalaman_kerja',
    perusahaan: 'perusahaan',
    reviewPerusahaan: 'review_perusahaan',
    tes: 'tes',
    users: 'users',
  };

  const [data, setData] = useState(
    Object.keys(tableMapping).reduce((acc, key) => ({ ...acc, [key]: [] }), {})
  );

  const [jobCategories, setJobCategories] = useState([]);

  useEffect(() => {
    async function fetchAllTables() {
      const tableKeys = Object.keys(tableMapping);
      const tableNames = Object.values(tableMapping);

      const fetchPromises = tableNames.map(name => supabase.from(name).select());
      const results = await Promise.all(fetchPromises);

      const newState = {};
      results.forEach((result, index) => {
        const key = tableKeys[index];
        newState[key] = result.data || [];
      });
      
      const pekerjaanList = newState.pekerjaan || [];

      const categoryCountMap = pekerjaanList.reduce((acc, curr) => {
        const kategori = curr.kategori || "Lainnya";
        acc[kategori] = (acc[kategori] || 0) + 1;
        return acc;
      }, {});

      const iconMap = {
        "Desain": "/images/Palette.svg",
        "Analis": "/images/PieChart.svg",
        "Teknisi Listrik": "/images/electric.svg",
        "Keuangan": "/images/finance.svg",
        "Teknologi": "/images/tech.svg",
        "Teknik": "/images/Gear.svg",
        "Pemasaran": "/images/Marketing.svg",
        "Pemrogram": "/images/Code.svg",
        "Lainnya": "/images/Default.svg"
      };

      const dynamicCategories = Object.entries(categoryCountMap).map(
        ([kategori, count]) => ({
          jobTitle: kategori,
          jobNo: count,
          jobIcon: iconMap[kategori] || "/images/Default.svg",
        })
      );

      setData(newState);
      setJobCategories(dynamicCategories);
    }

    fetchAllTables();
  }, []);

  return (
    <div>
      {isMobile ? (
        <div>
          
        </div>
      ) : (
        <LandingPage />
      )}
    </div>
  );
}

export default App;