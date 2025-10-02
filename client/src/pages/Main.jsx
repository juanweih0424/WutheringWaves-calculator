import LeftPanel from "../panel/LeftPanel"
import { useOutletContext } from "react-router-dom";
import { ResonatorProvider } from "../context/ResonatorContext";
import Stats from "../panel/Stats"
import { WeaponProvider } from "../context/WeaponContext";
import Basic from "../panel/Basic"
import Skill from "../panel/Skill";
import Ult from "../panel/Ult";
import Intro from "../panel/Intro";
import Outro from "../panel/Outro"
import Forte from "../panel/Forte"
import { EnemyProvider } from "../context/EnemyContext";
import { ChainProvider } from "../context/ChainContext";

export default function Main() {
  const { activePage } = useOutletContext();
  
  return (
    <ResonatorProvider>
      <WeaponProvider>
        <EnemyProvider>
          <ChainProvider>
      <div className="w-full p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 p-4">
          <aside className="lg:sticky
            h-fit max-h-[calc(100vh-var(--nav-h,3.5rem))] overflow-y-auto
            ">
              <LeftPanel activePanel={activePage}/>
          </aside>

          <aside className="lg:sticky
            h-fit max-h-[calc(100vh-var(--nav-h,3.5rem))] overflow-y-auto flex gap-y-6 flex-col
            ">
            <Stats/>
            <Basic/>
            <Skill/>
            <Forte/>
            <Ult/>
            <Intro/>
            <Outro/>
          </aside>
        </div>
      </div>
      </ChainProvider>
      </EnemyProvider>
      </WeaponProvider>
    </ResonatorProvider>
  )
}
