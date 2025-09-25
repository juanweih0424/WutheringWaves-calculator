import { useEffect, useState, useRef } from "react";
import setting from "../assets/images/ui/Setting.webp"

export default function ThemeSwitcher() {
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null); 
  const getInitialTheme = () => {
    const stored = localStorage.getItem("theme");
    if (stored === "dark" || stored === "light") return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };

  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.dataset.theme = "dark";
    } else {
      root.removeAttribute("data-theme");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

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
      <div className="relative inline-flex " ref={menuRef}>

      <button onClick={ () => setOpen(!open)} title="Theme" className="h-full w-[38px] p-1 cursor-pointer hover:bg-[var(--color-hover)] border-0 rounded-full lg:w-[46px]">
        <img src={setting} className="brightness-[var(--color-img)] object-contain hover:scale-[1.05] transition-transform duration-150"/> 
      </button>
        {open && (<div className="absolute top-full right-0 -mt-2 z-50 
                     flex flex-col gap-1 rounded-md border border-[var(--color-bg)]
                     bg-[var(--color-bg)]/95 backdrop-blur pb-2 py-3 gap-y-2 justify-center items-center shadow-lg w-16 lg:w-20 xl:w-24">
            <button onClick={()=>{setTheme('light');
              setOpen(false)
            }}
            className="flex gap-x-0.5 items-center cursor-pointer hover:scale-[1.05]  hover:bg-[var(--color-hover)] w-full justify-center
            transition-transform duration-150">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 lg:size-6 xl:size-7">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
          </svg>
          <p className="text-[10px]  tracking-tight md:text-[11px] lg:text-[13px] xl:text-[16px]">Light</p>
          </button>

          <button onClick={()=>{setTheme('dark');
            setOpen(false);
            }
          } 
            className="flex gap-x-0.5 items-center cursor-pointer hover:scale-[1.05] hover:bg-[var(--color-hover)] w-full justify-center
            transition-transform duration-150">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-4 lg:size-5 xl:size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
          </svg>
          <p className="text-[10px] tracking-tight md:text-[11px] lg:text-[13px] xl:text-[16px]">Dark</p>
          </button>
        </div>)}
        </div>

  );
}
