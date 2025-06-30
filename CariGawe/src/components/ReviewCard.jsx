
function ReviewCard({name, date, comment, rating}) {
    return(
        <div className="p-5 border border-gray-300 rounded-xl select-none cursor-default mb-5">
            <div className="flex justify-between font-montserrat text-gray-500 text-sm mb-3">
                <h1>{name}</h1>
                <h1>{date}</h1>
            </div>
            <p className="text-textBlack text-justify mb-5">{comment}</p>
            {
                Array(rating).fill(0).map((_, i) => (
                    <span key={i} role="img" aria-label="star">
                        ⭐ 
                    </span>
                ))
            }
        </div>
    )
}

export default ReviewCard;