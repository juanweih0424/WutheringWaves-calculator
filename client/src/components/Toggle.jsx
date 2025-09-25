import React, { useState, useRef, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import ThemeSwitcher from "./ThemeSwitcher"

export default function Toggle() {
    const [open,setOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative inline-flex">
      <div className="relative inline-flex h-full lg:hidden" ref={menuRef}> 
        <button
          type="button"
          onClick={() => setOpen(v => !v)}
          className="inline-flex h-full w-9 items-center justify-center "
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
          </svg>
        </button>

        {open && (
          <div
            role="menu"
            className="absolute right-0 top-full -mt-[1px] z-[60]
              w-20 bg-[var(--color-bg)] border border-[var(--color-bg)] rounded-lg  
              shadow-lg tracking-tight"
          >
            <a href="/about" className="block px-4 py-2 text-sm text-center">About</a>
            <a href="https://github.com/your/repo" target="_blank" rel="noreferrer"
              className="block px-4 py-2 text-sm text-center">Repo</a>
          </div>
        )}
      </div>
      <div className="hidden lg:flex lg:gap-x-2 lg:justify-center lg:items-center">
            <a href="/about" className="block text-sm lg:text-base text-center hover:text-[var(--color-text-hover)]">Placeholder</a>
      </div>
    </div>

    )
}
