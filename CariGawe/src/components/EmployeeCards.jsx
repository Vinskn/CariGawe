const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
};

function EmployeeCards({ children }){
    return(
        {children}
    )
}

function DashboardCard({ job, onEditClick, onDeleteClick }) {
    return (
        <div className="my-3 p-5 border-r-3 border-b-3 border-gray-300 rounded-xl flex justify-between items-center font-montserrat">
            <div className="flex gap-3 items-center">
                <img src="/images/google.svg" className="w-15"/>
                <div>
                    <h1 className="text-sm text-gray-700">{job.perusahaan?.nama_perusahaan || 'Perusahaan'}</h1>
                    <h1 className="text-lg text-gray-700 font-bold">{job.judul}</h1>
                </div>
            </div>
            <div className="flex gap-10 items-center">
                <h1 className="bg-mainOrange py-2 px-5 font-bold text-white rounded-xl">{job.total_pelamar || 0} Pelamar</h1>
                <div className="text-xs font-bold">
                    <h1>Posted: <span className="text-textTagGreen">{formatDate(job.tanggal_posting)}</span></h1>
                    <h1>Expired: <span className="text-mainRed">{formatDate(job.tanggal_berakhir) || "-"}</span></h1>
                </div>
            </div>
            <div className="flex gap-4 items-center">
                <img 
                    src="/images/Edit.svg" 
                    className="w-10 cursor-pointer" 
                    onClick={() => onEditClick(job)}
                />
                <img 
                    src="/images/Delete.svg" 
                    className="w-10 cursor-pointer" 
                    onClick={() => onDeleteClick(job)}
                />
            </div>
        </div>
    )
}

function PelamarCard(){
    return(
        <div className="flex justify-between items-center font-montserrat text-gray-600 w-full border-r-3 border-b-3 border-gray-300 rounded-xl py-3">
            <div className="flex gap-5 w-1/2 items-center">
                <img src="/images/EmptyProfile.svg" className="w-25"/>
                <div className="w-full">
                    <h1 className="font-bold text-xl">Nur Fitriani</h1>
                    <div className="flex text-xs gap-5">
                        <h1>Sr Web Desain</h1>
                        <h1 className="flex"><img src="/images/location.svg" className="w-4" /> Jakarta</h1>
                        <h1>Lamaran: 10 Mar 2024</h1>
                    </div>
                </div>
            </div>
            <div className="flex gap-3 mx-5">
                <img src="/images/Approve.svg" className="w-10"/>
                <img src="/images/Reload.svg" className="w-10"/>
                <img src="/images/DownloadYellow.svg" className="w-10"/>
                <img src="/images/Delete.svg" className="w-10"/>
            </div>
        </div>
    )
}

EmployeeCards.DashboardCard = DashboardCard;
EmployeeCards.PelamarCard = PelamarCard;
export default EmployeeCards;