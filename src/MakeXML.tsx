
import { ImageDataType } from "./ImageData"

const xmlTemplate = (cardList: string[]) => `
<?xml version="1.0" encoding="UTF-8"?>
<card-stack location.name="table" location.x="0" location.y="0" posZ="0" rotate="0" zindex="0" owner="" isShowTotal="true">
  <data name="card-stack">
    <data name="image">
      <data type="image" name="imageIdentifier"></data>
    </data>
    <data name="common">
      <data name="name">山札</data>
    </data>
    <data name="detail"></data>
  </data>
  <node name="cardRoot">
    ${cardList.join("\n")}
  </node>
</card-stack>
`;

const cardTemplate = (frontFileName: string, backFileName: string) => `
    <card location.name="table" location.x="0" location.y="0" posZ="0" state="0" rotate="0" owner="" zindex="0">
      <data name="card">
        <data name="image">
          <data type="image" name="imageIdentifier"></data>
          <data type="image" name="front">${frontFileName}</data>
          <data type="image" name="back">${backFileName}</data>
        </data>
        <data name="common">
          <data name="name">カード</data>
          <data name="size">2</data>
        </data>
        <data name="detail"></data>
      </data>
    </card>
`;


function makeXML(imageDataList: ImageDataType[], backImageName = "./assets/images/trump/z02.gif") {
  //裏面画像にはユドナリウムのデフォルトのトランプ画像を指定しておく
  const cardList = imageDataList.map((imageData: ImageDataType) => cardTemplate(imageData.encryptedName, backImageName));
  return xmlTemplate(cardList);
}

export { makeXML, cardTemplate };
