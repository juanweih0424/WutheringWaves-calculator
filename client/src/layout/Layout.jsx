import Nav from "../components/Nav.jsx";
import { Outlet } from "react-router-dom";
import React, { useState } from "react";

export default function Layout() {

  const [activePage, SetActivePage] = useState("resonator");

  return (
    <div className="min-h-svh flex flex-col">
      <Nav onSelect={SetActivePage} activePage={activePage}/>
      <main className="flex flex-1" role="main">
        <Outlet context={{activePage}}/>
      </main>
    </div>
  );
}