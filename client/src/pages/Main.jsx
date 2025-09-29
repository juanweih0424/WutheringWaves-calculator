import LeftPanel from "../panel/LeftPanel"
import { useOutletContext } from "react-router-dom";
import { ResonatorProvider } from "../context/ResonatorContext";
import Stats from "../panel/Stats"
import { WeaponProvider } from "../context/WeaponContext";
import Basic from "../panel/Basic"

export default function Main() {
  const { activePage } = useOutletContext();
  
  return (
    <ResonatorProvider>
      <WeaponProvider>
      <div className="w-full p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 p-4">
          <aside className="lg:sticky
            h-fit max-h-[calc(100vh-var(--nav-h,3.5rem))] overflow-y-auto
            ">
              <LeftPanel activePanel={activePage}/>
          </aside>

          <aside className="lg:sticky
            h-fit max-h-[calc(100vh-var(--nav-h,3.5rem))] overflow-y-auto
            ">
            <Stats/>
            <Basic/>
          </aside>
        </div>
      </div>
      </WeaponProvider>
    </ResonatorProvider>
  )
}
