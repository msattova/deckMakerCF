import {v4 as uuidv4} from "uuid"

import { CardCategory, CardType } from "./Card";
import { usePreviewCard } from "./previewContext";
import { selectCard } from "./ControlSqlite";

import cardViewStyle from "./cardViewStyle.module.css"

const addCardItem = (
  src: string,
  type: CardCategory,
  cardItems: CardType[],
  cardLimit: number,
  setCardItems: React.Dispatch<React.SetStateAction<CardType[]>>
) => {
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
};

/*
const removeCardItem = (
  id: string,
  setCardItems: React.Dispatch<React.SetStateAction<CardType[]>>
) => {
  setCardItems((prev) => prev.filter((elm) => elm.id != id));
};
*/

type CardView = {
  setPlayingItems: React.Dispatch<React.SetStateAction<CardType[]>>;
  setLifeItems: React.Dispatch<React.SetStateAction<CardType[]>>;
  setFragment: React.Dispatch<React.SetStateAction<CardType | undefined>>;
  playingItems: CardType[];
  lifeItems: CardType[];
  playingLimit: number;
  lifeLimit: number;
};

const CardView = ({ playingItems, lifeItems, setPlayingItems, setLifeItems, setFragment, playingLimit, lifeLimit }: CardView) => {
  const previewCard = usePreviewCard();

  //console.log("cardView", previewCard);

  const filename = previewCard.src.split("/").pop()?.replace(".png", "").trim();

  const result = filename ? selectCard(filename, previewCard.type) : [];
  const cardData = (result.length != 0 ? result[0] : null );
  console.log("cardData", cardData);
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
                      playingItems,
                      playingLimit,
                      setPlayingItems
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
                      lifeItems,
                      lifeLimit,
                      setLifeItems
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


const cardTypeConvert = (card_type: CardCategory) : string => {
    switch (card_type) {
      case "fragment":
        return "真祖の断片";
      case "arts":
        return "権能";
      case "kin":
        return "眷属";
      case "relic":
        return "秘宝";
      case "territory":
        return "領地";
      default:
        return "未定義";
    }
};

const colorConvert = (color: string) => {
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

export { CardView, cardTypeConvert };
