import { useEnemy } from "../context/EnemyContext";
import Slider from "../components/Slider";


export default function Enemy() {

    const {enemylvl, setEnemylvl, enemyres,setEnemyres} = useEnemy();
  return (
    <div className="flex flex-col items-center p-4 m-4">
        <p className="text-xl text-[var(--color-highlight)] font-semibold">Enemy Settings</p>
        <div className='border-0 w-full flex flex-col shadow-[0_4px_16px_rgba(0,0,0,0.15)] p-6 rounded-2xl mt-6 mx-4 '>
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
