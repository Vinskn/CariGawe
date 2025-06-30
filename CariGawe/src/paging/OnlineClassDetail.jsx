import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import OnlineClassComponent from "../components/OnlineClassComponent";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { setExamComplete, setScore, setTimer } from '../redux/slicer.js/examSlicer';
import { AuthUtils } from "../utils/auth";
import supabase from '../utils/supabaseClient';

function OnlineClassDetail({  }) {
    const [menuActive, setMenuActive] = useState(1);
    const [classData, setClassData] = useState({});
    const [examData, setExamData] = useState();
    const dispatch = useDispatch();
    const checkExampCompleate = useSelector(state => state.exam.examComplete);
    const { id } = useParams();

    useEffect(() => {
        const fetchAll = async () => {
            await fetchDataClass();
        };
        fetchAll();
    }, []);
    
    const fetchDataClass = async () => {
        let query = supabase.from('materi').select('*').eq("id", id);
        const { data, error } = await query;
        if (error) {
            console.error("Error fetching class data", error);
        } else {
            setClassData(data[0]);
        }
    };
    
    const handleTabExam = async () => {
        const getUserData = AuthUtils.getCurrentUser().id;
        
        const { data, error } = await supabase
            .from('hasil_tes')
            .select('*')
            .eq('materi_id', id)
            .eq('pelamar_id', getUserData);

        if (!error) {
            setExamData(data[0]);
        }

        const hasTaken = data && data.length > 0;

        if (!hasTaken) {
            const confirmation = window.confirm("Apakah Anda ingin mengerjakan tes? (Hanya bisa 1x)");
            if (confirmation) {
                setMenuActive(2);
            }
        } else {
            setMenuActive(2);
            dispatch(setExamComplete(true));          
        }
    };

    useEffect(() => {
        if (examData) {
            dispatch(setScore(examData.nilai));
        }
    }, [examData]);

    const insertExamData = async (skor) => {
        try {
            const getUserData = AuthUtils.getCurrentUser();
            const today = new Date();

            const { error } = await supabase
                .from('hasil_tes')
                .insert([{
                    pelamar_id: getUserData.id,
                    materi_id: id,
                    nilai: skor,
                    tanggal_tes: today
                }]);

            if (error) {
                console.error("Supabase error:", error);
            } else {
                dispatch(setExamComplete(true));
                dispatch(setTimer(false));
            }
        } catch (err) {
            console.error("Unexpected error:", err);
        }
    };

    
    let content = "";
    if (menuActive === 2) {
        content = checkExampCompleate ? <OnlineClassComponent.ClassGrade /> : <OnlineClassComponent.ClassTimer />;
    }

    return(
        <>
            <Navbar fromPage={1}/>
            <div className="m-7 mt-20">
                <div className="relative -z-10 bg-[url(/images/background-classDetail.png)] bg-center bg-no-repeat bg-cover rounded-xl p-7">
                    <div className="absolute inset-0 -z-5 bg-gradient-to-r from-blue7/60 from-30% to-transparent backdrop-blur-xs rounded-xl" />
                    <div className="text-white text-sm font-montserrat flex gap-2 items-center">
                        <p className="font-bold">{classData.kategori} &gt;</p>
                        <p>
                            {classData?.tags?.map((i, idx) => (
                                <span key={idx}>{` ${i} |`}</span>
                            ))}
                        </p>
                    </div>
                    <h1 className="mt-8 w-1/2 text-4xl font-baskerville text-white">{classData.judul}</h1>
                    <p className="mt-3 w-3/5 text-white font-montserrat">{classData.deskripsi}</p>
                    <div className="flex items-center gap-5 mt-6">
                        <h1 className="flex gap-2 items-center text-white font-montserrat">
                            <img src="/images/PersonCircle.svg" className="w-5" alt="author"/> {classData.author}
                        </h1>
                        <h1 className="text-yellow-400">
                            {classData.rating && Array(classData.rating).fill(0).map((_, idx) => ("★"))}
                            <span className="text-white ml-2">{classData.rating}.0</span>
                        </h1>
                    </div>
                </div>
                <div className="flex gap-5 mt-8">
                    <div className="w-7/10 border border-gray-300 rounded-lg">
                        <div className="flex justify-center gap-5 border-b border-gray-300">
                            <h1 className={`${menuActive === 1 ? "text-blue6 border-b border-blue6" : "text-gray-500"} px-2 py-2 font-montserrat select-none cursor-pointer`}
                                onClick={() => {setMenuActive(1)}}>
                                Materi
                            </h1>
                            <h1 className={`${menuActive === 2 ? "text-blue6 border-b border-blue6" : "text-gray-500"} px-2 py-2 font-montserrat select-none cursor-pointer`}
                                onClick={handleTabExam}>
                                Uji Kompentensi
                            </h1>

                            <h1 className={`${menuActive === 3 ? "text-blue6 border-b border-blue6" : "text-gray-500"} px-2 py-2 font-montserrat select-none cursor-pointer`}
                                onClick={() => {setMenuActive(3)}}>
                                Review
                            </h1>
                        </div>
                        <div className="p-5">
                            {menuActive === 1 && <OnlineClassComponent.ClassMaterial daftarIsi={classData.daftar_isi} konten={classData.konten}/>}
                            {menuActive === 2 && <OnlineClassComponent.ClassExam insertFunc={insertExamData}/>}
                            {menuActive === 3 && <OnlineClassComponent.ClassReview />}
                        </div>
                        <div className="flex gap-3 font-montserrat text-gray-500 w-1/3 items-center mb-10 px-5">
                            <h1 className="text-xs">Bagikan Kelas ini: </h1>
                            <a href="#"><img src="/images/FacebookGray.svg" alt="fb" className="w-5"/></a>
                            <a href="#"><img src="/images/InstagramGray.svg" alt="ig" className="w-5"/></a>
                            <a href="#"><img src="/images/LinkedinGray.svg" alt="ld" className="w-5"/></a>
                            <a href="#"><img src="/images/TwitterGray.svg" alt="x" className="w-5"/></a>
                        </div>
                    </div>
                    
                    <div className="w-3/10">
                        {content}
                        <OnlineClassComponent.RateClass/>
                    </div>
                </div>
            </div>
            <Footer/>
        </>
    );
}

export default OnlineClassDetail;