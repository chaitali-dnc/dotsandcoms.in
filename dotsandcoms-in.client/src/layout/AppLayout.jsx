import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";

const AppLayout = () => {
    useEffect(() => {
        window.hasLoadedOnce = true;
    }, []);

    return (
        <>
            <Header/>
            <Outlet />
            <Footer/>
        </>
    );
};

export default AppLayout;