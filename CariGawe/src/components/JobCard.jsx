import React from 'react';
const formatRupiah = (angka) => {
    if (angka === null || isNaN(angka)) {
        return "N/A";
    }
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(angka);
};

function JobCard(props) {
    const { job_id, judul, lokasi, status, deskripsi_singkat, rating, salary, tipe_pekerjaan, actionFunc } = props;

    return (
        <div
            onClick={() => { actionFunc(job_id); }}
            // The `bg-white` class has been added here to set the background to white.
            className="bg-white flex flex-col border-1 border-gray-300 rounded-lg cursor-pointer h-full shadow-sm hover:shadow-lg transition-shadow duration-200"
        >
            <div className="flex-grow">
                <div className="grid grid-cols-3 grid-rows-2 gap-2 mt-4 w-full font-montserrat">
                    <p className="col-start-1 row-start-1 px-2 bg-tagYellow rounded-r-2xl text-textTagYellow font-bold flex items-center h-full">{status}</p>
                    <p className="col-start-1 row-start-2 px-2 bg-tagGreen rounded-r-2xl text-textTagGreen text-sm font-bold flex items-center h-full">{tipe_pekerjaan}</p>

                    <img src={"/images/google.svg"} alt="Company Logo"
                        className="col-start-2 row-start-1 row-span-2 self-center justify-self-center" />

                    <p className="col-start-3 row-start-1 justify-end px-3 bg-tagBlue rounded-l-2xl text-blue5 text-sm font-bold flex items-center h-full">{formatRupiah(salary)}</p>

                    <p className="col-start-3 row-start-2 justify-center px-3 bg-tagRed rounded-l-2xl text-textTagGreen text-[10px] flex items-center h-full">
                        {Array(rating).fill(0).map((_, i) => (
                            <span key={i} role="img" aria-label="star">
                                ⭐
                            </span>
                        ))}
                    </p>
                </div>

                <h1 className="text-center mt-5 font-montserrat font-bold text-xl text-gray-800 px-4">{judul}</h1>
                <p className="mx-5 mt-2 text-justify text-gray-800 line-clamp-4">{deskripsi_singkat}</p>
            </div>

            <div className="mt-auto flex justify-between mx-5 pt-4 pb-4 border-t border-gray-100">
                <div className="flex items-center">
                    <img src="/images/location.svg" alt="location" className="mr-2" />
                    <h1>{lokasi}</h1>
                </div>
                <div className="cursor-pointer">
                    <img src="/images/arrowupgrey.svg" alt="arrowup" />
                </div>
            </div>

        </div>
    );
}

export default JobCard;