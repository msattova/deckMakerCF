
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

const DraggableCard = ({id, src, type}: CardType) => {
  const { setNodeRef, listeners, attributes, transform, isDragging } = useDraggable({id: id, data: {src: src, type: type}});


  const transformStyle = transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined;

  return (
    <div ref={setNodeRef} {...attributes} {...listeners}
    style={{
      transform: transformStyle,
      height: "fit-content",
      cursor: isDragging ? "grabbing" : "grab"
    }}>
      <Card id={id} src={src} type={type}/>
    </div>
  );
};

type ClickableCardType = {
  card: CardType;
  setCardItems: React.Dispatch<React.SetStateAction<CardType[]>>;
}

const ClickableCard = ({card, setCardItems}: ClickableCardType) => {
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


export { ClickableCard, DraggableCard, Card, isCardCategory };
export type { CardType, CardCategory };

