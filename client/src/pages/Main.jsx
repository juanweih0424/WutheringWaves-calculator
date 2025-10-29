import { useOutletContext } from "react-router-dom";
import LeftPanel from "../panel/LeftPanel";
import Stats from "../panel/Stats";
import Basic from "../components/Basic";
import Skill from "../components/Skill";
import Forte from "../components/Forte";
import Ult from "../components/Ult";
import Intro from "../components/Intro";
import Outro from "../components/Outro";

export default function Main() {
  const { activePage } = useOutletContext();

  return (
    <div className="w-full p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 p-4">
        <aside className="overflow-visible max-h-none lg:sticky lg:overflow-y-auto lg:max-h-[calc(100vh-var(--nav-h,3.5rem))] h-fit">
          <LeftPanel activePanel={activePage} />
        </aside>

        <aside className="overflow-visible max-h-none lg:sticky lg:overflow-y-auto lg:max-h-[calc(100vh-var(--nav-h,3.5rem))] h-fit flex flex-col gap-y-6">
          <Stats />
          <Basic />
          <Skill />
          <Forte />
          <Ult />
          <Intro />
          <Outro />
        </aside>
      </div>
    </div>
  );
}
