import sqlite3InitModule, {
  Database,
  Sqlite3Static,
} from "@sqlite.org/sqlite-wasm";
import { CardCategory, isCardCategory } from "./Card";
import { cardData } from "./assets/json";

const log = console.log;
const error = console.error;

let db: Database | null = null;

type dbCardDataType = {
  cardType: CardCategory;
  name: string;
  cost: string | undefined;
  color: string;
  text: string;
  power: string | undefined;
  condition: string | undefined;
  race: string | undefined;
};

const insertStmt = `
INSERT INTO cards (
  card_type,
  name,
  cost,
  color,
  text,
  power,
  condition,
  race
)
VALUES (
  $card_type,
  $name,
  $cost,
  $color,
  $text,
  $power,
  $condition,
  $race
)`;

const connectDB = (sqlite3: Sqlite3Static) => {
  log("Running SQLite3 version", sqlite3.version.libVersion);

  // OPFSを利用
  db = new sqlite3.oo1.DB("file:local?vfs=kvvfs", "ct");

  console.log(`DB size: ${sqlite3.capi.sqlite3_js_kvvfs_size()}`);

  return db;
};

const closeDB = () => {
  db?.close();
  db = null;
};

const insertCardData = (data: dbCardDataType, db: Database) => {
  //console.log("insertSTART", data);
  const stmt = db.prepare(insertStmt);
  try {
    stmt
      .bind({
        $card_type: data.cardType ? data.cardType : "undefined",
        $name: data.name,
        $cost: data.cost ? data.cost : null,
        $color: data.color,
        $text: data.text,
        $power: data.power ? data.power : null,
        $condition: data.condition ? data.condition : null,
        $race: data.race ? data.race : null,
      })
      .stepReset();
  } catch (err: any) {
    error("insertERR", err);
  } finally {
    stmt.finalize();
  }
};

const convertDBCardData = (obj: any): dbCardDataType => {
  return {
    cardType: isCardCategory(obj.type) ? obj.type : undefined,
    name: obj.name,
    cost: obj.cost ? obj.cost : undefined,
    color: obj.color.join("/"),
    text: obj.text,
    power: obj.power ? obj.power : undefined,
    condition: obj.condition ? obj.condition : undefined,
    race: obj.race ? obj.race : undefined,
  };
};

const resisterJSON = (db: Database) => {
  const result: any[] = [];
  db.exec({
    sql: "SELECT * FROM cards",
    rowMode: "object",
    resultRows: result,
  });
  console.log(result);
  if (result.length == cardData.length){
    return;
  }
  cardData.forEach((elm) => {
    insertCardData(convertDBCardData(elm), db);
  });
};

const selectCard = (name: string, type: CardCategory): any[] => {

  const result: any[] = [];
  if (!db){
    return [];
  }
  try {
    db.exec({
      sql: `SELECT card_type, color, condition, name, cost, text, power, race FROM cards
            WHERE name='${name}'
            AND card_type='${type ? type : "undefined"}';`,
      rowMode: "object",
      resultRows: result,
    });
  } catch(err: any){
    error("selectCard()", err);
  }
  return result;
};

const start = async (sqlite3: Sqlite3Static) => {
  log("Running SQLite3 version", sqlite3.version.libVersion);
  if (db) {
    return db;
  }
  try {
    db = connectDB(sqlite3);
    console.log("connect SUCCESS");
    //開発用。データベースをまっさらな状態にするためにテーブルを削除
    //db.exec("DROP TABLE cards");

    /**
     * ID：主キー（INT）
     * card_type, name, colorの組み合わせがすでにあるものと一致する値は挿入を禁止する
    ****/
    db.exec(`
    CREATE TABLE IF NOT EXISTS cards (
    id INTEGER PRIMARY KEY NOT NULL,
    card_type TEXT NOT NULL,
    name TEXT NOT NULL,
    cost TEXT,
    color TEXT NOT NULL,
    text TEXT NOT NULL,
    power TEXT,
    condition TEXT,
    race TEXT,
    UNIQUE(card_type, name, color)
    )
    `);
    resisterJSON(db);
    const result: any[] = [];
    db.exec({
      sql: "SELECT * FROM cards",
      rowMode: "object",
      resultRows: result,
    });
    console.log(result);
  } catch (err: any){
    error("start()",err);
  }
};

const initializeSQLite = async () => {
  try {
    log("Loading and initializing SQLite3 module ...");
    const sqlite3 = await sqlite3InitModule({
      print: log,
      printErr: error,
    });
    log("Done initializeing. Running demo...");
    start(sqlite3);
  } catch (err: any) {
    error("Initialization error:", err.name, err.message);
  }
};

export { initializeSQLite, closeDB, selectCard };
