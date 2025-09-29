export const statsAtLevel = (level,base,max)=>{
    if (level == 90) {
        return max;
    }
    if (level == 1) {
        return base;
    } 
    const c = (max-base)/89;
    const result = (level-1) * c + base;
    return result;
}