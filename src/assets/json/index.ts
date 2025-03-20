import arts from "./arts.json";
import fragment from "./fragment.json";
import kin from "./kin.json";
import relic from "./relic.json";
import territory from "./territory.json";

const cardData = [
  ...arts,
  ...relic,
  ...territory,
  ...kin,
  ...fragment
];


export { cardData };
