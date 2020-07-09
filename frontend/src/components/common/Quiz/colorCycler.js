import colors from "../../../assets/colors.json";

const colorCycler = {
  i: 0,
  colors: colors.statusTile.color,
  getColor: function () {
    if (this.i >= this.colors.length) this.i = 0;
    return this.colors[this.i++];
  },
};

export function getColor() {
  return colorCycler.getColor();
}
