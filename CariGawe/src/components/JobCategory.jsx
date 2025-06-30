function JobCategory(props) {
    const { jobName, jobAvail, jobImg, toFilter } = props;

    const handleCategoryClick = () => {
        toFilter({
            kategori: jobName,
            keyword: '',
            jobType: '',
            city: ''
        });
    };

    return (
        <div onClick={handleCategoryClick} className="flex p-3 border-1 border-gray-300 rounded-xl justify-center shadow-sm h-30 items-center hover:shadow-xl select-none cursor-pointer">
            <img src={jobImg} alt={jobName} className="w-1/6 mr-4" />
            <div>
                <h1 className="font-bold font-montserrat text-blue6 text-xl">{jobName}</h1>
                <p className="font-montserrat text-blue6">{jobAvail} Lowongan Tersedia</p>
            </div>
        </div>
    )
}

export default JobCategory;