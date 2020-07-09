import { useState } from "react";

export function shuffle(list) {
  let i, j, tmp;
  for (i = list.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * i);
    tmp = list[i];
    list[i] = list[j];
    list[j] = tmp;
  }
  return list;
}

//consecutive elements are assured to not repeat within colors.length
//issue: useState lagg breaks this setup
export function usePalette(colors) {
  /*returns (id)=>c; with c in colors; a consistent mapping
    (succesive calls for same id -> same c) */
  const [colInd, setColInd] = useState(0);
  const [colTrack, setColTrack] = useState({});
  const increment = () => setColInd((i) => i + 1);
  const colorPalette = shuffle(colors);

  //console.log(colorPalette);
  return (id) => {
    //console.log(id, colInd, colTrack);
    console.log(id, colTrack, colTrack[id], colInd);
    if (colTrack[id] === undefined) {
      console.log("inside");
      increment();
      const track = colTrack;
      track[id] = colorPalette[colInd];
      setColTrack(track);
    }
    return colTrack[id];
  };
}

export function useSimplePalette(colors) {
  /*returns (id)=>c; with c in colors; a consistent mapping
    (succesive calls for same id -> same c) */
  const colorPalette = shuffle(colors);

  //console.log(colorPalette);
  return (id) => {
    //console.log(id, colInd, colTrack);
    return colorPalette[id % colorPalette.length];
  };
}
