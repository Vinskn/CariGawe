function Footer() {
    return (
        <div className="bg-[url(/images/background-footer.png)] bg-center p-5">
            <div className="flex justify-around border-b-2 border-dashed border-white pb-15">
                <div>
                    <h1 className="text-3xl text-white font-baskerville font-bold">Cari Gawe</h1>
                    <p className="text-white font-montserrat text-lg mt-3">Discover your next career opportunity <br/> with ease. Explore the latest job <br/> openings tailored for you.</p>
                    <div className="flex justify-start gap-5 mt-10">
                        <a href="#"> <img src="/images/Facebook.svg" alt="#" /> </a>                
                        <a href="#"> <img src="/images/Instagram.svg" alt="#" /> </a>                                   
                        <a href="#"> <img src="/images/Linkedin.svg" alt="#" /> </a>   
                        <a href="#"> <img src="/images/Twitter.svg" alt="#" /> </a>                                 
                    </div>
                </div>

                <div className="flex flex-col text-white font-montserrat justify-around">
                    <h1 className="text-xl mb-5 font-semibold">Help Links</h1>
                    <a href="#">About Us</a>
                    <a href="#">Services</a>
                    <a href="#">Privacy Policy</a>
                    <a href="#">Terms & Condition</a>
                </div>

                <div className="flex flex-col justify-around text-white font-montserrat">
                    <h1 className="text-xl font-semibold">Subscribe Our Newsletter</h1>
                    <p>Get the freshest job news and articles <br/> delivered to your inbox every week.</p>
                    <input type="email" placeholder="Email Address" className="bg-white py-2 px-1 rounded-sm text-black"/>
                    <button className="bg-blue5 text-white font-bold w-1/4 py-2 rounded-lg place-self-end">Submit</button>
                </div>
            </div>
            <h1 className="text-white text-center">© 2025 All Right Reserved Brokoli.co </h1>
        </div>
    )
}

export default Footer;