function AdminComponents({ children }) {
    return (
        <children/>
    )
}

function DashboardCard() {
    return(
        <div className="my-3 p-5 border-r-3 border-b-3 border-gray-300 rounded-xl flex justify-between items-center font-montserrat">
            <div className="flex gap-3 items-center">
                <img src="/images/google.svg" className="w-15"/>
                <div>
                    <h1 className="text-sm text-gray-700">Google</h1>
                    <h1 className="text-lg text-gray-700 font-bold">Techincal Content Writer</h1>
                </div>
            </div>
            <div className="text-xs font-bold">
                    <h1>Posted: <span className="text-textTagGreen">17 Apr 2024</span></h1>
                    <h1>Expired: <span className="text-mainRed">20 Apr 2024</span></h1>
            </div>
            <div className="flex gap-4 items-center">
                <img src="/images/Edit.svg" className="w-10" />
                <img src="/images/Delete.svg" className="w-10" />
            </div>
        </div>
    )
}

AdminComponents.DashboardCard = DashboardCard;
export default AdminComponents;