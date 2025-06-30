import { useState, useRef } from "react";
import ErrorForm from "./BubbleForm";
import supabase from '../utils/supabaseClient'

function Signup({ closeForm, toLogin }) {
    const [role, setRole] = useState(0);
    const [error, setError] = useState(false);
    const [errorMessege, setErrorMessage] = useState();
    const [status, setStatus] = useState();
    const inputRefs = useRef([]);
    const formSetter = role == 0 ?{
        label1: "Name",
        label1Placeholder: "Your Name",
        label2: "Email",
        label2Placeholder : "Enter your email",
        profileIcon : "/images/PersonW.svg",
        companyIcon: "images/BuildingB.svg",
        profileBtnColor: "bg-blue6",
        profileTextColor: "text-white",
        companyBtnColor: "",
        companyTextColor : "text-blue6",
        loginTo: "/"
    } : {
        label1: "Company Name",
        label1Placeholder: "Your Name",
        label2: "Company Email",
        label2Placeholder : "Enter your company email",
        profileIcon : "/images/PersonB.svg",
        companyIcon: "images/BuildingW.svg",
        profileBtnColor: "",
        profileTextColor: "text-blue6",
        companyBtnColor: "bg-blue6",
        companyTextColor : "text-white",
        loginTo: "/"
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const [nameInput, emailInput, passwordInput, termsInput] = inputRefs.current;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!nameInput.value || !emailInput.value || !passwordInput.value || !termsInput.checked) {
            setStatus('error');
            setErrorMessage("Isi semua field");
            setError(true);
            return;
        }

        if (!emailRegex.test(emailInput.value)) {
            setStatus('error');
            setErrorMessage("Masukkan email yang valid");
            setError(true);
            return;
        }

        try {
            const { data, error } = await supabase
                .from('users')
                .insert([
                    {
                        name: nameInput.value,
                        email: emailInput.value,
                        password: passwordInput.value,
                        role: role === 0 ? "pelamar" : "perusahaan"
                    }
                ]);

            if (error) {
                console.error("Error inserting data:", error);
                setStatus('error');
                setErrorMessage("Gagal membuat user");
                setError(true);
            } else {
                console.log("User created:", data);
                setStatus('success');
                setErrorMessage("User berhasil dibuat, mengalihkan...");
                setError(true);

                setTimeout(() => {
                    setError(false);
                    toLogin();
                }, 3000);
            }
        } catch (e) {
            console.error("Unexpected error:", e);
            setStatus('error');
            setErrorMessage("Terjadi kesalahan");
            setError(true);
        }
    };

    const handleCloseError = () => {
        setError(false);
    }


    return (
        <div className="absolute z-10 bg-blue1/50 backdrop-blur-xl w-full h-screen flex justify-center items-center">
            {error && <ErrorForm errorStatus={handleCloseError} message={errorMessege} status={status}/>}
            <div className="relative flex bg-white w-9/10 h-9/10 shadow-xl rounded-xl">
                <button onClick={closeForm} className="absolute z-20 top-0 right-0 m-5 w-8 cursor-pointer"><img src="/images/X.svg" alt="X" /></button>
                <div className="relative inset-0 bg-[url('/images/background.png')] bg-cover bg-left w-1/2 rounded-l-xl"/>
                <div className="relative flex flex-col justify-center w-1/2">
                    <h1 className="text-blue7 text-center text-3xl font-baskerville mb-5 font-bold">Create an account</h1>
                    <div className="flex justify-center gap-10 font-montserrat">
                        <button onClick={() => setRole(0)} className={`flex flex-row items-center gap-x-1 px-5 py-1 rounded-lg ${formSetter.profileBtnColor} ${formSetter.profileTextColor}`}>
                            <img src={formSetter.profileIcon} alt="#" />
                            Personal
                        </button>
                        <button onClick={() => setRole(1)} className={`flex flex-row items-center gap-x-1 px-5 py-1 rounded-lg ${formSetter.companyBtnColor} ${formSetter.companyTextColor}`}>
                            <img src={formSetter.companyIcon} alt="#" />
                            Company
                        </button>
                    </div>

                    <div className="flex flex-col justify-center items-center mt-5 mx-15">
                        <label htmlFor="name" className="text-xs font-montserrat self-start">{formSetter.label1}</label>
                        <input ref={(elm) => (inputRefs.current[0] = elm)} id="name" type="text" required placeholder={formSetter.label1Placeholder} className="border-1 border-gray-300 rounded-lg w-full py-2 mb-4 px-2 focus:outline-none"/>
                        <label htmlFor="email" className="text-xs font-montserrat self-start">Email</label>
                        <input ref={(elm) => (inputRefs.current[1] = elm)} id="email" type="email" required placeholder={formSetter.label2Placeholder} className="border-1 border-gray-300 rounded-lg w-full py-2 mb-4 px-2 focus:outline-none"/>
                        <label htmlFor="password" className="text-xs font-montserrat self-start">Password</label>
                        <input ref={(elm) => (inputRefs.current[2] = elm)} id="password" type="password" placeholder="Create a strong password" required className="border-1 border-gray-300 rounded-lg w-full py-2 mb-4 px-2 focus:outline-none"/>
                        <div className="flex gap-2">
                            <input ref={(elm) => (inputRefs.current[3] = elm)} type="checkbox" />
                            <p>Yes, I understand and agree to the  
                                <a href="#" className="underline underline-offset-2 text-blue4"> Terms & Conditions</a>.</p>
                        </div>
                        <button onClick={handleSubmit} className="mt-10 bg-blue6 w-full py-1.5 rounded-lg font-bold font-montserrat text-white hover:bg-blue7">Signup</button>
                        <p className="mt-2">Already have an account? <span onClick={() => {closeForm(); toLogin();}} className="text-blue5 cursor-pointer">Login</span></p>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Signup;