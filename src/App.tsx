import { DndContext, MouseSensor, useSensor, useSensors } from "@dnd-kit/core";
import { memo, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import styles from "./style.module.css";

import { LoadCards } from "./LoadImages";
import { DeckArea, FragmentArea } from "./DeckArea";
import { CardType } from "./Card";
import { CardView } from "./CardView";
import { PreviewProvider } from "./previewContext";

import { initializeSQLite } from "./ControlSqlite";

// 素だと再描画のたびに折り畳み状態がリセットされるので、その抑制目的でmemo化
const LoadImagedMemo = memo(() => <LoadCards />);

const playingLimit = 30;
const lifeLimit = 10;

const DeckEditMenu = () => {
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 5,
    },
  });

  const sensors = useSensors(mouseSensor);

  const [playingItems, setPlayingItems] = useState<CardType[]>([]);
  const [lifeItems, setLifeItems] = useState<CardType[]>([]);
  const [fragment, setFragment] = useState<CardType>();

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={(event) => {
        const { over } = event;
        if (over == null) {
          return;
        }
        //Drop時の処理
        const type = event.active.data.current?.type;

        if (over.id == "playingdeck" && type != "fragment") {
          setPlayingItems((prev) => [
            ...prev,
            {
              id: uuidv4(),
              src: event.active.data.current?.src,
              type: event.active.data.current?.type,
            },
          ]);
          //もし上限枚数より多ければ最初に追加されたカードを取り除く
          if (playingItems.length >= playingLimit) {
            setPlayingItems((prev) => prev.slice(1, playingLimit + 1));
          }
        } else if (over.id == "lifedeck" && type != "fragment") {
          setLifeItems((prev) => [
            ...prev,
            {
              id: uuidv4(),
              src: event.active.data.current?.src,
              type: event.active.data.current?.type,
            },
          ]);
          //もし上限枚数より多ければ最初に追加されたカードを取り除く
          if (lifeItems.length >= lifeLimit) {
            setLifeItems((prev) => prev.slice(1, lifeLimit + 1));
          }
        } else if (over.id == "fragment" && type == "fragment") {
          setFragment({
            id: uuidv4(),
            src: event.active.data.current?.src,
            type: event.active.data.current?.type,
          });
        }
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
          />
        </div>
      </div>
    </DndContext>
  );
};

function App() {
  initializeSQLite();
  return (
    <div style={{
      margin: "0 auto"
    }}>
      <header>
        <h1 className={styles.headerContainer}>DeckMaker</h1>
      </header>
      <details style={{
        fontSize: "0.8em"
      }}>
        <summary>取扱説明書</summary>
        <ul>
          <li>ドラッグアンドドロップでカードを移動させて、デッキに登録</li>
          <li>デッキのカードをダブルクリックでカード削除</li>
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
          <DeckEditMenu />
          <div className={styles.previewContainer}>
            <CardView />
          </div>
        </div>
      </PreviewProvider>
    </div>
  );
}

export default App;
