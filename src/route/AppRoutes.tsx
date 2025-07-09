import React, {Suspense} from "react";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import MainLayout from "@/components/MainLayout";
import SeatPage from "@/page/SeatPage/SeatPage";
import PurchasePage from "@/page/PurchasePage/PurchasePage";
// import Loader from "@/components/Loader/Loader";

const router = createBrowserRouter(
    [
        {
            path: "",
            element: <MainLayout />,
            handle: {title: "Trang chủ"},
            children: [
                {
                    index: true,
                    element: <SeatPage />,
                    handle: {title: "Chọn ghế"},
                },
                {
                    path: "seat",
                    element: <SeatPage />,
                    handle: {title: "Chọn ghế"},
                },
                {
                    path: "purchase",
                    element: <PurchasePage />,
                    handle: {title: "Thanh toán vé"},
                },
                // Nếu dynamic cần loader:
                // {
                //   path: "movie/:id",
                //   element: <MovieDetailPage />,
                //   loader: async ({ params }) => {
                //     const data = await fetchMovieById(params.id!);
                //     return { title: data.title, ...data };
                //   },
                // },
            ],
        },
    ],
    {basename: "/movie-ticket"}
);

export default function App() {
    return <RouterProvider router={router} />;
}
