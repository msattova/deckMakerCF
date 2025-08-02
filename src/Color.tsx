import { v4 as uuidv4 } from "uuid";

import { CardType } from "./Card";

type Color =
  | "white"
  | "blue"
  | "black"
  | "red"
  | "green"
  | "colorless"
  | undefined;

const colorConvert = (color: string | Color): string => {
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

const convertColorCode = (color: string | Color): string => {
  switch (color) {
    case "red":
      return "#ff0000";
    case "blue":
      return "#0000ff";
    case "white":
      return "#ffff00";
    case "black":
      return "#000000";
    case "green":
      return "#00ff00";
    case "colorless":
      return "#ffffff";
    default:
      return "#aaaaaa";
  }
};

type DeckColorView = {
  cards: CardType[];
};

const DeckColorView = ({ cards }: DeckColorView) => {
  let colorCounter = {
    red: cards.filter((elm) => elm.color.includes("red")).length,
    blue: cards.filter((elm) => elm.color.includes("blue")).length,
    black: cards.filter((elm) => elm.color.includes("black")).length,
    white: cards.filter((elm) => elm.color.includes("white")).length,
    green: cards.filter((elm) => elm.color.includes("green")).length,
    colorless: cards.filter((elm) => elm.color.includes("colorless")).length,
  };
  console.log("color, ", colorCounter);
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(6, 1fr)",
        columnGap: "5px",
        margin: "2px 10px",
      }}
    >
      {Object.entries(colorCounter).map(([key, val]) => (
        <div
          key={uuidv4()}
          style={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <div
            style={{
              width: "20px",
              height: "20px",
              backgroundColor: `${convertColorCode(key)}`,
              borderRadius: "50%",
            }}
          ></div>
          <div>{val}</div>
        </div>
      ))}
    </div>
  );
};

export type { Color };
export { colorConvert, DeckColorView };
