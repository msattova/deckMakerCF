
type Color =
  | "white"
  | "blue"
  | "black"
  | "red"
  | "green"
  | "colorless"
  | undefined;


const colorConvert = (color: string | Color) => {
  switch (color) {
    case "red":
      return "赤";
    case "blue":
      return "青";
    case "white":
      return "白";
    case "black":
      return "黒";
    case "green":
      return "緑";
    case "colorless":
      return "無色";
    default:
      return "無色";
  }
};



export type { Color };
export { colorConvert };
