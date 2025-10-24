import { useEnemy } from "../context/EnemyContext";
import Slider from "../components/Slider";


export default function Enemy() {

    const {enemylvl, setEnemylvl, enemyres,setEnemyres} = useEnemy();
  return (
    <div className="flex flex-col items-center m-4">
        <p className="text-base lg:text-lg text-[var(--color-highlight)] font-semibold">Enemy Settings</p>
        <div className='border-1 w-full flex flex-col shadow-md border-gray-500/30 p-6 rounded-2xl mt-6 mx-4 '>
        <Slider
            label="Enemy Level"
            min={0}
            max={120}
            step={1}
            onChange={setEnemylvl}
            value={enemylvl}
        />
        <Slider
            label="Enemy Resistance"
            min={0}
            max={100}
            step={10}
            onChange={setEnemyres}
            value={enemyres}
        />
        </div>
    </div>
  )
}
