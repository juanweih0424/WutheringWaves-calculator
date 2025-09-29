import React, { useState, useRef, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import ThemeSwitcher from "../components/ThemeSwitcher"
import Toggle from "./Toggle";
import Header from "./Header";

export default function Nav({onSelect, activePage}) {

  return (
    <nav className="
      sticky top-0 z-40
      bg-[var(--color-bg)] backdrop-blur
      border-b border-[var(--color-bg)]
      shadow-sm">
      <div className="w-full h-10 md:h-12 xl:h-15 flex items-center justify-between">
        <Header onSelect={onSelect} activePage={activePage} />
        <div className="flex items-center gap-1 md:gap-2">
          <Toggle />
          <ThemeSwitcher />
        </div>
      </div>
    </nav>
  );
}
