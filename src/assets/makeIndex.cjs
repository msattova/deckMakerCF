const fs = require("fs");
const path = require("path");

/* 取得すべきカード一覧のファイル名をあらかじめJSONファイルに記載しておく */

const dirs = ["arts", "fragment", "relic", "kin", "territory"];

const getFileNames = (dirs) => {
  const ret = new Map();
  const cardsPath = path.resolve(__dirname, "../../public/cards");
  dirs.forEach(dir => {
    ret.set(dir, fs.readdirSync(`${cardsPath}/${dir}`));
  });
  return ret;
};


const files = getFileNames(dirs);

const json = JSON.stringify(Object.fromEntries(files));


fs.writeFileSync(`${__dirname}/cards.json`, json);
