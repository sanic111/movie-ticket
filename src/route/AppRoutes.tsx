import React, {Suspense} from "react";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import MainLayout from "@/components/MainLayout";
import SeatPage from "@/page/SeatPage/SeatPage";
import PurchasePage from "@/page/PurchasePage/PurchasePage";
import TermsPage from "@/page/TermsPage/TermsPage";

const router = createBrowserRouter(
    [
        {
            path: "",
            element: <MainLayout />,
            handle: {titleKey: "pages.home"}, // Dùng key thay vì hardcode
            children: [
                {
                    index: true,
                    element: <SeatPage />,
                    handle: {titleKey: "pages.selectSeat"},
                },
                {
                    path: "seat",
                    element: <SeatPage />,
                    handle: {titleKey: "pages.selectSeat"},
                },
                {
                    path: "purchase",
                    element: <PurchasePage />,
                    handle: {titleKey: "pages.payment"},
                },
                {
                    path: "terms-and-policy",
                    element: <TermsPage />,
                    handle: {titleKey: "pages.termsAndPolicy"},
                },
            ],
        },
    ],
    {basename: "/movie-ticket"}
);

export default function App() {
    return <RouterProvider router={router} />;
}