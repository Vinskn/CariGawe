// src/components/Login.jsx
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthUtils } from '../utils/auth';
import { useAuth } from '../hooks/useAuth';
import ErrorForm from "./BubbleForm";
import supabase from '../utils/supabaseClient'


function Login({ closeForm, roleNo, toSignup }) {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [role, setRole] = useState(roleNo);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const emailRef = useRef(null);
    const passRef = useRef(null);

    const formSetter = role == 0 ? {
        emailPlaceholder: "Enter Your Email",
        passPlaceholder: "Enter your password",
        profileIcon: "/images/PersonW.svg",
        companyIcon: "images/BuildingB.svg",
        profileBtnColor: "bg-blue6",
        profileTextColor: "text-white",
        companyBtnColor: "",
        companyTextColor: "text-blue6",
        userRole: "pelamar"
    } : {
        emailPlaceholder: "Enter your company email",
        passPlaceholder: "Enter your password",
        profileIcon: "/images/PersonB.svg",
        companyIcon: "images/BuildingW.svg",
        profileBtnColor: "asd",
        profileTextColor: "text-blue6",
        companyBtnColor: "bg-blue6",
        companyTextColor: "text-white",
        userRole: "perusahaan"
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const email = emailRef.current.value.trim();
        const password = passRef.current.value.trim();

        setIsLoading(true);
        setError(false);

        try {
            // Query the users table based on selected role
            const { data: users, error: dbError } = await supabase
                .from('users')
                .select('*')
                .eq('email', email)
                .eq('role', formSetter.userRole)
                .single();

            if (dbError || !users) {
                setErrorMessage("Invalid email or user not found for selected role");
                setError(true);
                setIsLoading(false);
                return;
            }

            // Simple password comparison (In production, use proper password hashing)
            if (users.password !== password) {
                setErrorMessage("Invalid password");
                setError(true);
                setIsLoading(false);
                return;
            }

            const userData = {
                id: users.id,
                name: users.name,
                email: users.email,
                role: users.role,
                loginTime: new Date().toISOString()
            };
            
            // --- MODIFICATION START ---
            // Directly call and await the async utility that sets the session.
            // This guarantees localStorage is fully updated with company_id before proceeding.
            await AuthUtils.setUserSession(userData);

            // Now, call the login function from the hook to update the global app state.
            // We no longer need to await this part.
            login(userData);
            // --- MODIFICATION END ---

            // Navigate based on role, now that the session is guaranteed to be correct.
            const redirectPath = AuthUtils.getRedirectPath(users.role);
            navigate(redirectPath, { replace: true });

        } catch (error) {
            console.error('Login error:', error);
            setErrorMessage("An error occurred during login. Please try again.");
            setError(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCloseError = () => {
        setError(false);
        setErrorMessage("");
    };

    return (
        <div className="absolute z-10 bg-blue1/50 backdrop-blur-xl w-full h-screen flex justify-center items-center">
            {error ? <ErrorForm errorStatus={handleCloseError} message={errorMessage} status="error" /> : ""}
            <div className="relative flex bg-white w-9/10 h-9/10 shadow-xl rounded-xl">
                <button onClick={closeForm} className="absolute z-20 top-0 right-0 m-5 w-8 cursor-pointer">
                    <img src="/images/X.svg" alt="X" />
                </button>
                <div className="relative inset-0 bg-[url('/images/background.png')] bg-cover bg-left w-1/2 rounded-l-xl"/>
                <div className="relative flex flex-col justify-center w-1/2">
                    <h1 className="text-blue7 text-center text-3xl font-baskerville mb-5 font-bold">Welcome Back</h1>
                    <div className="flex justify-center gap-10 font-montserrat">
                        <button 
                            onClick={() => setRole(0)} 
                            className={`flex flex-row items-center gap-x-1 px-5 py-1 rounded-lg ${formSetter.profileBtnColor} ${formSetter.profileTextColor}`}
                            disabled={isLoading}
                        >
                            <img src={formSetter.profileIcon} alt="#" />
                            Personal
                        </button>
                        <button 
                            onClick={() => setRole(1)} 
                            className={`flex flex-row items-center gap-x-1 px-5 py-1 rounded-lg ${formSetter.companyBtnColor} ${formSetter.companyTextColor}`}
                            disabled={isLoading}
                        >
                            <img src={formSetter.companyIcon} alt="#" />
                            Company
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center mt-5 mx-15">
                        <label htmlFor="email" className="text-xs font-montserrat self-start">Email</label>
                        <input 
                            ref={emailRef} 
                            id="email" 
                            type="email" 
                            required 
                            placeholder={formSetter.emailPlaceholder} 
                            className="border-1 border-gray-300 rounded-lg w-full py-2 mb-4 px-2"
                            disabled={isLoading}
                        />
                        <label htmlFor="password" className="text-xs font-montserrat self-start">Password</label>
                        <input 
                            ref={passRef} 
                            id="password" 
                            type="password" 
                            placeholder={formSetter.passPlaceholder} 
                            required 
                            className="border-1 border-gray-300 rounded-lg w-full py-2 mb-4 px-2"
                            disabled={isLoading}
                        />
                        <div className="flex justify-between w-full">
                            <div className="flex gap-2">
                                <input type="checkbox" disabled={isLoading} />
                                <p>Remember Me?</p>
                            </div>
                            <a href="#" className="text-blue5">Forgot Password?</a>
                        </div>
                        <button 
                            type="submit" 
                            className={`mt-10 w-full py-1.5 rounded-lg font-bold font-montserrat text-white ${
                                isLoading 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-blue6 hover:bg-blue7'
                            }`}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Logging in...' : 'Login'}
                        </button>
                        <p className="mt-2">Don't have an account? 
                            <span onClick={() => toSignup()} className="text-blue5 cursor-pointer">Sign Up</span>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;