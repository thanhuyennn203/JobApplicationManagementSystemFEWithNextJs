"use client";

import "@/styles/admin/AdminPage.css";

const members = [
    {
        name: "George Lindelof",
        mobile: "+4 315 23 62",
        email: "carlsen@armand.no",
        status: "Active",
        img: "https://i.pravatar.cc/40?img=1",
    },
    {
        name: "Eric Dyer",
        mobile: "+2 134 25 65",
        email: "cristofer.ajer@lone.no",
        status: "Active",
        img: "https://i.pravatar.cc/40?img=2",
    },
    {
        name: "Haitam Alessami",
        mobile: "+1 345 22 21",
        email: "haitam@gmail.com",
        status: "Active",
        img: "https://i.pravatar.cc/40?img=3",
    },
    {
        name: "Michael Campbel",
        mobile: "+1 756 52 73",
        email: "camp@hotmail.com",
        status: "Inactive",
        img: "https://i.pravatar.cc/40?img=4",
    },
];

export default function AdminPage() {
    return (
        <div style={{ width: "100%" }}>
            <h1>Home page</h1>
        </div>
    );
}