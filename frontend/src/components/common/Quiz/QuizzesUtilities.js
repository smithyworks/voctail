import { useState } from "react";
import timediff from "timediff";

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

export function timeElapsed(last) {
  let d = "";
  if (!isNaN(last)) {
    const { months, days, hours, minutes } = timediff(new Date(last), new Date(), "MDHm");
    if (months > 0 || days > 0 || hours > 0 || minutes > 0) {
      if (months > 0) {
        d += `${hours} M`;
      } else if (days > 0) {
        d += `${hours} D`;
      } else if (hours > 0) {
        d += `${hours} h`;
      } else if (minutes > 0) {
        d += `${minutes} min`;
      }
    } else d = "just now";
  } else d = "Untaken";

  return d;
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

export function generatePalette(colors) {
  /*returns (id)=>c; with c in colors; a consistent mapping
    (succesive calls for same id -> same c) */
  const colorPalette = shuffle(colors);

  //console.log(colorPalette);
  return (id) => {
    //console.log(id, colInd, colTrack);
    return colorPalette[id % colorPalette.length];
  };
}
