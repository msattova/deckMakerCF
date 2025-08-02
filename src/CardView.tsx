import {v4 as uuidv4} from "uuid"

import { CardCategory, CardType, CountCardType, cardTypeConvert } from "./Card";
import { usePreviewCard } from "./previewContext";
import { selectCard } from "./ControlSqlite";

import cardViewStyle from "./cardViewStyle.module.css"
import { Color, colorConvert } from "./Color";

const addCardItem = (
  src: string,
  type: CardCategory,
  color: Color[],
  cardItems: CardType[],
  cardLimit: number,
  countCard: CountCardType[],
  setCardItems: React.Dispatch<React.SetStateAction<CardType[]>>,
  setCountCard: React.Dispatch<React.SetStateAction<CountCardType[]>>,
  sameCardLimit: number
) => {
  console.log(countCard)
  console.log("items", cardItems)
  // すでにカードが同名カードの上限枚数分デッキに入っているなら追加しない
  if (countCard.length != 0 && countCard.filter(elm => elm.id == src).length != 0 && countCard.filter(elm => elm.id == src)[0].num == sameCardLimit){
    return;
  }
  setCardItems((prev) => [
    ...prev,
    {
      id: uuidv4(),
      src: src,
      type: type,
      color: color
    },
  ]);
  setCountCard((prev) => {
    // 追加したカードがなければ新しく追加
    if (prev.filter(elm => elm.id == src).length == 0){
      return [
        ...prev,
        {
          id: src,
          num: 1
        }
      ]
    }
    else{
      return [
        ...prev.filter((elm) => elm.id != src),
        {
          id: src,
          num: prev.filter((elm) => elm.id == src)[0].num+1
        },
      ];
    }
  })
  //もし上限枚数より多ければ最初に追加されたカードを取り除く
  if (cardItems.length >= cardLimit) {
    setCardItems((prev) => prev.slice(1, cardLimit + 1));
  }
};

/*
const removeCardItem = (
  id: string,
  setCardItems: React.Dispatch<React.SetStateAction<CardType[]>>
) => {
  setCardItems((prev) => prev.filter((elm) => elm.id != id));
};
*/

type CardViewType = {
  setPlayingItems: React.Dispatch<React.SetStateAction<CardType[]>>;
  setLifeItems: React.Dispatch<React.SetStateAction<CardType[]>>;
  setFragment: React.Dispatch<React.SetStateAction<CardType | undefined>>;
  playingItems: CardType[];
  lifeItems: CardType[];
  playingLimit: number;
  lifeLimit: number;
  countCard: CountCardType[];
  setCountCard: React.Dispatch<React.SetStateAction<CountCardType[]>>;
  sameCardLimit: number;
};

const CardView = ({ playingItems, lifeItems, setPlayingItems, setLifeItems, setFragment, playingLimit, lifeLimit, countCard, setCountCard, sameCardLimit }: CardViewType) => {
  const previewCard = usePreviewCard();

  //console.log("cardView", previewCard);

  const filename = previewCard.src.split("/").pop()?.replace(".png", "").trim();

  const result = filename ? selectCard(filename, previewCard.type) : [];
  const cardData = (result.length != 0 ? result[0] : null );
  console.log("cardData", cardData)
  if (cardData != null){
    console.log("cardColor", cardData.color.split("/"));
  }
  return (
    <div>
      {previewCard.src != "" ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            columnGap: "3px",
          }}
        >
          <div
            style={{
              margin: "auto",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <header
              style={{
                margin: "auto",
              }}
            >
              {cardData.name}
            </header>
            <img
              style={{
                maxHeight: "32vh",
                width: "fit-content",
              }}
              src={`${import.meta.env.BASE_URL}${previewCard.src.slice(1)}`}
              title={filename}
              alt={`${filename}(${previewCard.type})`}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              rowGap: "4px",
              margin: "auto",
            }}
          >
            {cardData.card_type == "fragment" ? (
              <button
                type="button"
                onClick={() => {
                  setFragment({
                    id: uuidv4(),
                    src: previewCard.src,
                    type: previewCard.type,
                    color: cardData.color.split("/"),
                  });
                }}
              >
                Into Deck
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    addCardItem(
                      previewCard.src,
                      previewCard.type,
                      cardData.color.split("/"),
                      playingItems,
                      playingLimit,
                      countCard,
                      setPlayingItems,
                      setCountCard,
                      sameCardLimit
                    );
                  }}
                >
                  +1 Play
                </button>
                <button
                  type="button"
                  onClick={() => {
                    addCardItem(
                      previewCard.src,
                      previewCard.type,
                      cardData.color.split("/"),
                      lifeItems,
                      lifeLimit,
                      countCard,
                      setLifeItems,
                      setCountCard,
                      sameCardLimit
                    );
                  }}
                >
                  +1 Life
                </button>
              </>
            )}
          </div>

          {cardData ? (
            <TextView
              cardType={cardData.card_type}
              name={cardData.name}
              text={cardData.text}
              color={cardData.color.split("/")}
              power={cardData.power}
              cost={cardData.cost}
              condition={cardData.condition}
              race={cardData.race}
            />
          ) : (
            <></>
          )}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

type TextDataType = {
  cardType: CardCategory;
  name: string;
  text: string;
  color: string[];
  power: string | undefined;
  cost: string | undefined;
  condition: string | undefined;
  race: string | undefined;
};

const TextView = ({cardType, text, color, power, cost, condition, race}: TextDataType) => {

  return (
    <article
      style={{
        marginRight: "16px",
        marginLeft: "8px",
        marginBottom: "8px",
      }}
    >
      <div>
        <dl className={cardViewStyle.gridContainer}>
          <div className={cardViewStyle.row1span2Style}>
            <dt>種族</dt>
            <dd className={cardViewStyle.ddStyleNoContentEnd}>
              {race ? race : "-"}
            </dd>
          </div>
          <div className={cardViewStyle.row1span2Style}>
            <dt>カードタイプ</dt>
            <dd className={cardViewStyle.ddStyleNoContentEnd}>
              {cardTypeConvert(cardType)}
            </dd>
          </div>
          <div className={cardViewStyle.row1span2Style}>
            <dt>色</dt>
            <dd
              className={`${cardViewStyle.colorContainer} ${cardViewStyle.ddStyleNoContentEnd}`}
            >
              {color.map((c) => (
                <div key={uuidv4()}>{colorConvert(c)}</div>
              ))}
            </dd>
          </div>
          <div className={cardViewStyle.row1span2Style}>
            <dt>コスト</dt>
            <dd className={cardViewStyle.ddStyleNoContentEnd}>
              {cost ? cost : "なし"}
            </dd>
          </div>
          <div className={cardViewStyle.row1span2Style}>
            <dt>戦闘力</dt>
            <dd className={cardViewStyle.ddStyleNoContentEnd}>
              {power ? power : "-"}
            </dd>
          </div>
          {condition ? (
            <div className={`${cardViewStyle.span2Style}`}>
              <dt>登場条件</dt>
              <dd>
                {condition.split("\n").map((part) => (
                  <div key={uuidv4()}>{part}</div>
                ))}
              </dd>
            </div>
          ) : (
            <></>
          )}
          <div className={`${cardViewStyle.span2Style}`}>
            <dt>テキスト</dt>
            <dd style={{
              overflowY: "scroll",
              height: "15em"
            }}>
              {text.split("\n").map((part) => (
                <div key={uuidv4()}>{part}</div>
              ))}
            </dd>
          </div>
        </dl>
      </div>
    </article>
  );
}

export { CardView };
