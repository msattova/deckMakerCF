import axios from "axios";
import { AsyncZipOptions, zip } from "fflate";
import { v4 as uuidv4 } from "uuid";
import CryptoJS from "crypto-js";

import { ImageDataType } from "./ImageData";
import { makeXML, cardTemplate } from "./MakeXML";
import { CardType } from "./Card";

//ユドナリウム向けzipデータを生成してダウンロードする

const compress = async (
  files: File[],
  fileName: string,
  compressOptions: AsyncZipOptions | undefined = undefined
): Promise<File> => {
  try {
    const options = compressOptions || {};
    const fileContents: Record<string, Uint8Array> = {};
    const promises = files.map(async (f) => {
      const arrayBuffer = await f.arrayBuffer();
      fileContents[f.name] = new Uint8Array(arrayBuffer);
    });
    await Promise.all(promises);
    const zippedContent: Uint8Array = await new Promise((resolve, reject) => {
      zip(fileContents, options, (err, data) => {
        if (err) {
          reject(err);
        }
        resolve(data);
      });
    });
    return new File([zippedContent], fileName);
  } catch (err) {
    return Promise.reject(new Error(`compress failed: ${err}`));
  }
};

const getImage = async (src: string): Promise<ImageDataType> => {
    //console.log("src:", src);
    const res = await axios.get(`${import.meta.env.BASE_URL}${src.slice(1)}`, {
      responseType: "arraybuffer",
    });
    //console.log("res", res);
    const arrayBuffer = res.data;
    const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
    const encrypted = CryptoJS.SHA256(wordArray);
    const blob = new Blob([arrayBuffer], {type: "image/png"});
    const dataUrl = URL.createObjectURL(blob);

    const basename = src.split("/").pop()?.replace(".png", "");

  const imageData = {
      fileName: basename ? basename : "unknown",
      encryptedName: encrypted.toString(),
      dataURL: dataUrl,
      id: uuidv4(),
      blob: blob,
    };

  return imageData;
};

type DownloadDeckButtonProps = {
  targetFiles: CardType[];
  deckName: string;
};

const DownloadDeckButton = ({
  targetFiles,
  deckName
}: DownloadDeckButtonProps): React.JSX.Element => {

  const makeFiles = (
    imageDataList: ImageDataType[],
    backImageData: ImageDataType
  ): File[] => {
    const xmlStr = makeXML(imageDataList, backImageData.encryptedName);
    const xmlFile = new File([xmlStr], "data.xml", {
      type: "application/xml",
    });

    const backImageFile = new File(
      [backImageData.blob],
      `${backImageData.encryptedName}.png`,
      { type: backImageData.blob.type }
    );

    const imageFiles = imageDataList.map(
      (data) =>
        new File([data.blob], `${data.encryptedName}.png`, {
          type: data.blob.type,
        })
    );

    return [xmlFile, backImageFile, ...imageFiles];
  };

  const downloadZipFile = async () => {
    const imageDataList = targetFiles.map((file) => getImage(file.src));
    const backImage = await getImage( "cards/backImage.png" );
    //console.log("back:", backImage);
    Promise.all(imageDataList).then((resolved) => {
      const compressfiles = makeFiles(resolved, backImage);
      const zipFile = compress(compressfiles, `${deckName}.zip`);
      zipFile.then((zipfile) => {
        let zipBlob = new Blob([zipfile], { type: "application/zip" });
        const url = URL.createObjectURL(zipBlob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${deckName}.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
    });
  };

  return (
    <div>
      <button onClick={downloadZipFile}>Download ZIP</button>
    </div>
  );
};

type DownloadCardButtonProps = {
  targetFile: CardType;
  deckName: string;
};


const DownloadCardButton = ({
  targetFile,
  deckName,
}: DownloadCardButtonProps): React.JSX.Element => {

  const makeFiles = (
    imageData: ImageDataType,
    backImageData: ImageDataType
  ): File[] => {
    const xmlStr = cardTemplate(imageData.encryptedName, backImageData.encryptedName);
    const xmlFile = new File([xmlStr], "data.xml", {
      type: "application/xml",
    });

    const backImageFile = new File(
      [backImageData.blob],
      `${backImageData.encryptedName}.png`,
      { type: backImageData.blob.type }
    );

    const imageFile = new File(
          [imageData.blob],
          `${imageData.encryptedName}.png`,
          {
            type: imageData.blob.type,
          });

    return [xmlFile, backImageFile, imageFile];
  };

  const downloadZipFile = async () => {
    const backImage = await getImage("/cards/backImage.png");
    //console.log("back:", backImage);
    getImage(targetFile.src).then((resolved) => {
      const compressfiles = makeFiles(resolved, backImage);
      const zipFile = compress(compressfiles, `${deckName}.zip`);
      zipFile.then((zipfile) => {
        let zipBlob = new Blob([zipfile], { type: "application/zip" });
        const url = URL.createObjectURL(zipBlob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${deckName}.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
    });
  };

  return (
    <div>
      <button onClick={downloadZipFile}>Download ZIP</button>
    </div>
  );
};


export { DownloadDeckButton, DownloadCardButton };
