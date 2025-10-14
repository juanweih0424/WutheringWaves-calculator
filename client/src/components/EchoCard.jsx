import { getEchoImageUrl } from "../utils/echo";
import { getEchoSetImageUrl } from "../utils/echo";

export default function EchoCard({ echo, onSelect }) {
  const img = getEchoImageUrl(echo?.id);
  const setIds = Array.isArray(echo?.echo_sets) ? echo.echo_sets : [];

  return (
    <button
      type="button"
      onClick={() => onSelect?.(echo)}
      className="p-3 hover:scale-110 cursor-pointer ease-in-out duration-200 transition-transform"
      title={echo?.name}
    >
      <div className="w-full aspect-square rounded-full overflow-hidden border border-amber-400 mb-2">
        {img ? (
          <img src={img} className="w-full h-full object-cover" />
        ) : (
          null
        )}
      </div>
      <div className="flex flex-col items-center">
        {!!setIds.length && (
          <div className="flex gap-1 mt-1">
            {setIds.map((sid) => {
              const sImg = getEchoSetImageUrl(sid);
              return sImg ? (
                <img
                  key={sid}
                  src={sImg}
                  className="h-5 w-5 lg:h-7 lg:w-7 object-cover"
                />
              ) : (
                null
              );
            })}
          </div>
        )}
        <p className="text-xs lg:text-sm font-medium">{echo?.name}</p>
        {echo?.cost != null && (
          <p className="text-xs lg:text-sm opacity-70">Cost: {echo.cost}</p>
        )}
    </div>
    </button>
  );
}
