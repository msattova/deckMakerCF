import { v4 as uuidv4 } from "uuid";

import { CardType, RemovableCard, Card } from "./Card";
import deckStyles from "./deckStyle.module.css"
import { DownloadDeckButton, DownloadCardButton } from "./DownloadZip";
import { useCallback, useState } from "react";

type DeckListType = {
  cards: CardType[];
  id: string;
  limit: number;
  setCardItems: React.Dispatch<React.SetStateAction<CardType[]>>;
  isShrink: boolean;
};

//デッキ一覧表示コンポーネント
const DeckList = ({cards, id, limit, setCardItems, isShrink}: DeckListType) => {
  //const { isOver, setNodeRef} = useDroppable({id: id});
  const rowCardsNum = 5;
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${rowCardsNum}, 82px)`,
        gridTemplateRows: `repaet(${Math.ceil(limit / rowCardsNum)}, 120px)`,
        gridAutoRows: "120px",
        gap: "4px 2px",
        height: isShrink
          ? `${(120 + 4) * 1}px`
          : `${(120 + 4) * Math.ceil(limit / rowCardsNum)}px`,
        padding: "2px",
        width: `${rowCardsNum*84}px`,
        overflowY: isShrink ? "scroll" : "clip",
        overflowX: "hidden",
        backgroundColor: "lightgray",
      }}
    >
      {cards.map((card) => (
        <RemovableCard key={card.id} card={card} setCardItems={setCardItems} />
      ))}
    </div>
  );
};

type DeckAreaType = {
  id: string;
  title: string;
  limit: number;
  downloadName: string;
  cards: CardType[];
  setCardItems: React.Dispatch<React.SetStateAction<CardType[]>>;
};

const DeckArea = ({id, title, cards, limit, downloadName, setCardItems}: DeckAreaType) => {
  const [isShrink, setIsShrink] = useState<boolean>(true);
  const toggleShrink = useCallback(()=>{
    setIsShrink(!isShrink);
  }, [isShrink]);
  const counter = cards.length;
  return (
    <div>
      <div style={{
        display: "flex",
        flexDirection: "row",
        rowGap: "2px",
        alignItems: "center"
      }}>
        <h3>
          {title} （{counter}/{limit}枚）
        </h3>
        <DownloadDeckButton targetFiles={cards} deckName={downloadName} />
        <button onClick={toggleShrink}>{isShrink ? "拡大" : "縮小"}</button>
      </div>
      <div className={deckStyles.deckContainer}>
        <DeckList id={id} cards={cards} limit={limit} setCardItems={setCardItems} isShrink={isShrink}/>
      </div>
    </div>
  );
};

type FragmentAreaType = {
  id: string,
  card: CardType | undefined
};

const FragmentArea = ({id, card}: FragmentAreaType) => {
  const filename = card ? card.src.split('/').pop()?.replace(".png", "") : "";

  // console.log("FragmentArea", card);

  return (
    <div>
      <h3>
        真祖の断片{filename != "" ? <span>【{filename}】</span> : <span></span>}
      </h3>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          rowGap: "2px",
          alignItems: "center",
        }}
      >
        <div className={deckStyles.deckContainer}>
          <div
            style={{
              color: "#333",
              width: "fit-content",
              padding: "2px",
              minWidth: "fit-content",
              backgroundColor: "lightgray",
            }}
          >
            {card ? (
              <Card
                key={uuidv4()}
                id={card.id}
                src={card.src}
                type={card.type}
              />
            ) : (
              <p>真祖の断片が登録されていません</p>
            )}
          </div>
        </div>
        {card && filename ? (
          <DownloadCardButton targetFile={card} deckName={filename} />
        ) : (
          <span></span>
        )}
      </div>
    </div>
  );
};

export { DeckArea, FragmentArea };
