import { useEffect, useState } from "react";
import ReviewCard from "./ReviewCard";
import supabase from '../utils/supabaseClient'

function JobDetailComponent ({ children }) {
    return (
        <div className="mt-5 p-5 border-1 border-gray-300/50 rounded-lg">
            {children}
            <div className="flex justify-between mx-5 mt-5">
                <div className="flex gap-3 font-montserrat text-gray-500 w-1/3 items-center">
                    <h1 className="text-xs">Bagikan Pekerjaan ini: </h1>
                    <a href="#"><img src="/images/FacebookGray.svg" alt="fb" className="w-5"/></a>
                    <a href="#"><img src="/images/InstagramGray.svg" alt="ig" className="w-5"/></a>
                    <a href="#"><img src="/images/LinkedinGray.svg" alt="ld" className="w-5"/></a>
                    <a href="#"><img src="/images/TwitterGray.svg" alt="x" className="w-5"/></a>
                </div>
            </div>
        </div>
    )
}

function JobDescription({ descData }) {
    return (
        <div>
            <p className="text-justify text-gray-600 font-montserrat text-sm">
                {descData}
            </p>
        </div>
    )
}

function JobRequisite({ requistData }) {
        console.log(requistData);
        
    return(
        <div className="font-montserrat text-gray-500 text-sm">
            <h1 className="mt-3 font-bold">Persyaratan</h1>
            <ul className="list-disc list-inside">
                {
                    requistData.persyaratan.map((i, idx) => (
                        <li key={idx}>{i}</li>
                    ))
                }
            </ul>

            <h1 className="mt-3 font-bold">Tanggung Jawab</h1>
            <ul className="list-disc list-inside">
                {
                    requistData.tanggung_jawab.map((i, idx) => (
                        <li key={idx}>{i}</li>
                    ))
                }
            </ul>

            <h1 className="mt-3 font-bold">Kualifikasi dan Keahlian</h1>
            <ul className="list-disc list-inside">
                {
                    requistData.kualifikasi_dan_keahlian.map((i, idx) => (
                        <li key={idx}>{i}</li>
                    ))
                }
            </ul>
        </div>
    )
}

function CompanyReview({ companyId }) {
    const [reviewData, setReviewData] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            let query = supabase
                .from('review_perusahaan')
                .select('*, pelamar(*)')
                .eq('perusahaan_id', companyId)
            const { data, error} = await query
            if (error) {
                console.log("Err Bagian Pekerjaan", error);
                return;
            } else {
                setReviewData(data);
            }
        }
        fetchData()
    }, [])

    useEffect(() => {
        console.log(reviewData);
        
    }, [reviewData])

    return(
       <div className="h-screen overflow-y-auto">
            {
                reviewData.map((i, idx) => (
                    <ReviewCard
                    key={idx}
                    name={`${i.pelamar?.first_name || '???'} ${i.pelamar?.last_name || ''}`}
                    date={i.tanggal_review}
                    comment={i.komentar}
                    rating={i.rating}
                    />
                ))
            }
       </div>
    )
}

JobDetailComponent.JobDescription = JobDescription;
JobDetailComponent.JobRequisite = JobRequisite;
JobDetailComponent.CompanyReview = CompanyReview;
export default JobDetailComponent;