import React from "react";
import {Outlet} from "react-router-dom";
import Header from "./Header";
import { usePageTitle } from "@/utils/usePageTitle";

const MainLayout: React.FC = () => {
    usePageTitle(); // Tự động cập nhật title khi route thay đổi
    
    return (
        <div className="main-layout">
            <Header />
            <main>
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;