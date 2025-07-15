
import { useDraggable } from "@dnd-kit/core";
import cardstyle from "./imageStyle.module.css"
import { useSetPreviewCard } from "./previewContext";
import { useCallback } from "react";
import { v4 as uuidv4 } from "uuid";

type CardCategory =
  | "fragment"
  | "arts"
  | "kin"
  | "relic"
  | "territory"
  | undefined ;


type CardType = {
  id: string;
  src: string;
  type: CardCategory;
}

const isCardCategory = (str: string | undefined): str is CardCategory => {
  return str !== undefined && ["fragment", "arts", "kin", "relic", "territory"].includes(str);
}

const Card = ({ id, src, type }: CardType) => {
  const filename = src.split('/').pop()?.replace(".png", "");
  const setCard = useSetPreviewCard();
  const set = useCallback(() => {
    setCard({ id: uuidv4(), src: src, type: type });
  }, [setCard]);
  return (
  <div onClick={set}>
    <img key={id} className={cardstyle.cardImage} src={src} title={filename} alt={`${filename}(${type})`}/>
  </div>
  );
}

type ClickableCardType = {
  card: CardType;
  setCardItems: React.Dispatch<React.SetStateAction<CardType[]>>;
}

type AddableCardType = {
  card: CardType;
  setCardItems: React.Dispatch<React.SetStateAction<CardType[]>>;
  cardItems: CardType[];
  cardLimit: number;
};

const RemovableCard = ({card, setCardItems}: ClickableCardType) => {
  const {id, src, type} = card;
  return (
  <div
  onDoubleClick={(event)=>{
    console.log("double: "+event);
    setCardItems((prev) => prev.filter(elm => elm.id!=id));
  }}>
    <Card id={id} src={src} type={type}/>
  </div>
  );
};

const AddableCard = ({ card, setCardItems, cardItems, cardLimit }: AddableCardType) => {
  const { id, src, type } = card;
  return (
    <div
      onDoubleClick={(event) => {
        console.log("double: " + event);
        setCardItems((prev) => [
                    ...prev,
                    {
                      id: uuidv4(),
                      src: src,
                      type: type,
                    },
                  ]);
        //もし上限枚数より多ければ最初に追加されたカードを取り除く
        if (cardItems.length >= cardLimit) {
          setCardItems((prev) => prev.slice(1, cardLimit + 1));
        }
      }}
    >
      <Card id={id} src={src} type={type} />
    </div>
  );
};


export { AddableCard, RemovableCard, Card, isCardCategory };
export type { CardType, CardCategory };

