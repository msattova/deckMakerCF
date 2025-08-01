import { Link } from "react-router-dom";
import styles from "../style.module.css";

function Header() {
  return (
    <>
      <header>
        <h1 className={styles.headerContainer}>DeckMaker</h1>
      </header>
      <Link to="/rule">
        ゲームルール（暫定版）
      </Link>
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
          <li>
            同名カードはデッキ全体（プレイングデッキとライフデッキ）において4枚まで入れることができます
          </li>
        </ul>
      </details>
    </>
  );
}

export { Header }
