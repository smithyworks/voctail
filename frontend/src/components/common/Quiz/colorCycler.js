import colors from "../../../assets/colors.json";

const colorCycler = {
  i: 0,
  colors: colors.statusTile.color,
  getColor: function (hash) {
    if (hash) return this.colors[hash % this.colors.length];
    else {
      if (this.i >= this.colors.length) this.i = 0;
      return this.colors[this.i++];
    }
  },
};

function hashFnv32a(str) {
  let hval = 0x811c9dc5;

  for (let i = 0, l = str.length; i < l; i++) {
    hval ^= str.charCodeAt(i);
    hval += (hval << 1) + (hval << 4) + (hval << 7) + (hval << 8) + (hval << 24);
  }

  return hval >>> 0;
}

export function getColor(str) {
  return colorCycler.getColor(str ? hashFnv32a(str) : undefined);
}
