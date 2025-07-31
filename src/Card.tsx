
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

type CountCardType = {
  id: string;
  num: number;
};

const toCardCategoryfromString = (card_type: string): CardCategory => {
  switch (card_type) {
    case "fragment":
      return "fragment";
    case "arts":
      return "arts";
    case "kin":
      return "kin";
    case "relic":
      return "relic";
    case "territory":
      return "territory";
    default:
      return undefined;
  }
};

const isCardCategory = (str: string | undefined): str is CardCategory => {
  return str !== undefined && ["fragment", "arts", "kin", "relic", "territory"].includes(str);
}

const Card = ({ id, src, type }: CardType) => {
  const filename = src.split('/').pop()?.replace(".png", "");
  const setCard = useSetPreviewCard();
  const set = useCallback(() => {
    setCard({ id: uuidv4(), src: src, type: type });
  }, [setCard]);
  // src単体だと先頭に'/'が含まれてしまうのでsliceで1文字目の'/'を抜いている
  return (
    <div onClick={set}>
      <img
        key={id}
        className={cardstyle.cardImage}
        src={`${import.meta.env.BASE_URL}${src.slice(1)}`}
        title={filename}
        alt={`${filename}(${type})`}
      />
    </div>
  );
}

type RemovableCardType = {
  card: CardType;
  setCardItems: React.Dispatch<React.SetStateAction<CardType[]>>;
  setCountCard: React.Dispatch<React.SetStateAction<CountCardType[]>>;
};

type AddableCardType = {
  card: CardType;
  setCardItems: React.Dispatch<React.SetStateAction<CardType[]>>;
  cardItems: CardType[];
  cardLimit: number;
  countCard: CountCardType[];
};

const RemovableCard = ({card, setCardItems, setCountCard}: RemovableCardType) => {
  const {id, src, type} = card;
  return (
  <div
  onDoubleClick={(event)=>{
    console.log("double: "+event);
    setCardItems((prev) => prev.filter(elm => elm.id!=id));

    setCountCard((prev) => prev.map(elm => elm.id == src ? {id: src, num: elm.num-1 } : {id: src, num: elm.num}));
  }}>
    <Card id={id} src={src} type={type}/>
  </div>
  );
};

const AddableCard = ({ card, setCardItems, cardItems, cardLimit }: AddableCardType) => {
  const { id, src, type } = card;
  return (
    <div
      onDoubleClick={(_) => {
        setCardItems((prev) => [
          ...prev,
          {
            id: uuidv4(),
            card_id: id,
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


export {
  AddableCard,
  RemovableCard,
  Card,
  isCardCategory,
  toCardCategoryfromString
  };
export type { CardType, CountCardType, CardCategory };

