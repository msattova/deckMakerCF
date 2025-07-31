import { memo, useState } from "react";

import styles from "./style.module.css";

import { LoadCards } from "./LoadImages";
import { DeckArea, FragmentArea } from "./DeckArea";
import { CardType, CountCardType } from "./Card";
import { CardView } from "./CardView";
import { PreviewProvider } from "./previewContext";

import { initializeSQLite } from "./ControlSqlite";

// 素だと再描画のたびに折り畳み状態がリセットされるので、その抑制目的でmemo化
const LoadImagedMemo = memo(() => <LoadCards />);

const playingLimit = 30;
const lifeLimit = 10;
const sameCardLimit = 4;

function App() {
  initializeSQLite();


  const [playingItems, setPlayingItems] = useState<CardType[]>([]);
  const [lifeItems, setLifeItems] = useState<CardType[]>([]);
  const [fragment, setFragment] = useState<CardType>();
  const [countCard, setCountCard] = useState<CountCardType[]>([]);

  return (
    <div
      style={{
        margin: "0 auto",
      }}
    >
      <header>
        <h1 className={styles.headerContainer}>DeckMaker</h1>
      </header>
      <details
        style={{
          fontSize: "0.8em",
        }}
      >
        <summary>取扱説明書</summary>
        <ul>
          <li>カード画像をクリックすると画面右側にカード情報が表示されます</li>
          <li>「Into Deck」で真祖の断片をデッキに登録</li>
          <li>「+1 Play」でプレイングデッキにカードを登録</li>
          <li>「+1 Life」でライフデッキにカードを登録</li>
          <li>デッキのカードをダブルクリックでカード削除</li>
          <li>
            デッキが完成したら"Download
            ZIP"からユドナリウムにドラッグアンドドロップ可能な形式のZIPファイルをダウンロード可能です
          </li>
        </ul>
      </details>
      <details
        style={{
          fontSize: "0.8em",
        }}
      >
        <summary>デッキの構築ルール</summary>
        <ul>
          <li>
            デッキはリーダーとなるカードである「真祖の断片」1枚、山札となるプレイングデッキ30枚、プレイヤーの命となるライフデッキ10枚から構成されます
          </li>
          <li>
            ※デッキの上限枚数を越えてカードを登録した場合、最初に登録されたカードから削除されます
          </li>
        </ul>
      </details>
      <PreviewProvider>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            columnGap: "8px",
          }}
        >
          <div className={styles.menuContainer}>
            <div className={styles.cardsContainer}>
              <h2>カード一覧</h2>
              <LoadImagedMemo />
            </div>
            <div className={styles.decksContainer}>
              <h2>デッキ内容</h2>
              <FragmentArea id="fragment" card={fragment} />
              <DeckArea
                id="playingdeck"
                title="プレイングデッキ"
                cards={playingItems}
                limit={playingLimit}
                downloadName={
                  fragment
                    ? `【${fragment.src
                        .split("/")
                        .pop()
                        ?.replace(".png", "")}】プレイングデッキ`
                    : "プレイングデッキ"
                }
                setCardItems={setPlayingItems}
                countCard={countCard}
                setCountCard={setCountCard}
              />
              <DeckArea
                id="lifedeck"
                title="ライフデッキ"
                cards={lifeItems}
                limit={lifeLimit}
                downloadName={
                  fragment
                    ? `【${fragment.src
                        .split("/")
                        .pop()
                        ?.replace(".png", "")}】ライフデッキ`
                    : "ライフデッキ"
                }
                setCardItems={setLifeItems}
                countCard={countCard}
                setCountCard={setCountCard}
              />
            </div>
          </div>
          <div className={styles.previewContainer}>
            <CardView
              playingItems={playingItems}
              lifeItems={lifeItems}
              setPlayingItems={setPlayingItems}
              setLifeItems={setLifeItems}
              setFragment={setFragment}
              playingLimit={playingLimit}
              lifeLimit={lifeLimit}
              countCard={countCard}
              setCountCard={setCountCard}
              sameCardLimit={sameCardLimit}
            />
          </div>
        </div>
      </PreviewProvider>
    </div>
  );
}

export default App;
