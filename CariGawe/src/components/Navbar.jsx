import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { setPage } from "../redux/slicer.js/navbarSlicer"
import { AuthUtils } from "../utils/auth";

function Navbar({ onLoginClick, onCompLogin, fromPage }) {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const isEmployeer = AuthUtils.hasRole('perusahaan');
    const globalPageState = useSelector(state => state.navbar.page)
    
    const berandaClick = () => {
        if (fromPage !== 0) {
            dispatch(setPage(0))
            navigate('/home')
            window.scrollTo({top: 0, behavior: 'smooth'})
        } else {
            onLoginClick();
        }
    }

    const lowonganClick = () => {
        if (fromPage !== 0) {
            dispatch(setPage(1));
            navigate('/jobs')
        } else {
            onLoginClick();
        }
    }

    const kelasClick = () => {
        if (fromPage !== 0) {
            dispatch(setPage(2));
            navigate('/home/onlineclass')
            window.scrollTo({top: 0, behavior: 'smooth'})
        } else {
            onLoginClick();
        }
    }

    const logoutClick = () => {
        AuthUtils.logout();
        navigate('/', { replace: true });
    }

    const employeerDashboardClick = () => {
        navigate('/home/employeer');
        window.scrollTo({top: 0, behavior: 'smooth'})
    }
    
    return (
        <div className="flex justify-between px-10 py-5 items-center fixed top-0 left-0 right-0 z-50 bg-blue1">
            <h1 className="text-blue6 font-bold text-3xl font-baskerville">CariGawe</h1>
            <div className="flex gap-15 font-montserrat select-none cursor-default">
                <a onClick={() => berandaClick()} className={fromPage == 0 ? "text-blue7 underline underline-offset-4" : (globalPageState == 0 ? "text-blue7 underline underline-offset-4" : "text-black")}>Beranda</a>
                <a onClick={() => lowonganClick()} className={fromPage == 0 ? "" : (globalPageState == 1 ? "text-blue7 underline underline-offset-4" : "text-black")}>Lowongan Kerja</a>
                <a onClick={() => kelasClick()} className={fromPage == 0 ? "" : (globalPageState == 2 ? "text-blue7 underline underline-offset-4" : "text-black")}>Kelas Online</a>
            </div>
            <div className={`flex gap-10 font-montserrat font-bold ${isEmployeer && fromPage !== 0 ? "flex-row-reverse" : ""}`}>
                {
                    fromPage == 0 ? ( // Public landing page: Login and For Employer
                        <>
                            <button className="rounded-lg px-5 py-1.5 hover:bg-blue2" onClick={onLoginClick}>Login</button>
                            <button className="bg-blue6 text-white rounded-lg px-3 py-1.5 hover:bg-blue7" onClick={onCompLogin}>For Employer</button>
                        </>
                    ) : (
                        <>
                            {isEmployeer && (
                                <button className="bg-blue6 text-white rounded-lg px-3 py-1.5 hover:bg-blue7" onClick={employeerDashboardClick}>For Employer</button>
                            )}
                            <img onClick={logoutClick} src="/images/logout.svg" className="w-8 h-8 object-cover cursor-pointer"/>
                        </>
                    )
                }
            </div>
        </div>
    )
}

export default Navbar;