import cardList from "./assets/cards.json"
import cardstyle from "./imageStyle.module.css"
import { cardData } from "./assets/json"
import { v4 as uuidv4 } from "uuid"
import { DraggableCard, isCardCategory } from "./Card"



const LoadCards = () => {

  console.log("cardData",cardData);

  const images = Object.entries(cardList).map(
    ([key, val]) =>
      <div key={uuidv4()}>
        <details>
          <summary>{key}</summary>
        <div className={cardstyle.cardsList}>
          {val.map( (elm) =>
             <DraggableCard key={uuidv4()} id={uuidv4()}  src={`/cards/${key}/${elm}`} type={isCardCategory(key) ? key : undefined} />
          )}
        </div>
        </details>
      </div> );

  return (<div className={cardstyle.cardsContainer}>{images}</div>);

};

export {LoadCards};

