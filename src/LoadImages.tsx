import cardList from "./assets/cards.json"
import cardstyle from "./imageStyle.module.css"
import { v4 as uuidv4 } from "uuid"
import { Card, isCardCategory, toCardCategoryfromString } from "./Card"
import { cardTypeConvert } from "./CardView"



const LoadCards = () => {

  //console.log("cardData",cardData);

  const images = Object.entries(cardList).map(
    ([key, val]) =>
      <div key={uuidv4()}>
        <details>
          <summary>{cardTypeConvert(toCardCategoryfromString( key))}</summary>
        <div className={cardstyle.cardsList}>
          {val.map( (elm) =>
             <Card key={uuidv4()}
                id={uuidv4()}
                src={`/cards/${key}/${elm}`}
                type={isCardCategory(key) ? key : undefined}
              />
          )}
        </div>
        </details>
      </div> );

  return (<div className={cardstyle.cardsContainer}>{images}</div>);

};

export {LoadCards};

