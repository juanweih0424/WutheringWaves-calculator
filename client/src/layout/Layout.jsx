import React from "react";
import Nav from "../components/Nav.jsx";
import { Outlet } from "react-router-dom";
import Header from "../components/Header.jsx";
export default function Layout() {
  return (
    <div className="min-h-svh flex flex-col bg-[var(--color-bg)]">
      <Nav />
      <main className="flex flex-1" role="main">
        <Outlet />
      </main>
    </div>
  );
}