import { createContext, Dispatch, SetStateAction, FC, useState, useContext } from "react";

import { CardType } from "./Card";


const previewContext = createContext<CardType>({id: "", src: "", type: undefined});

const setPreviewContext = createContext<Dispatch<SetStateAction<CardType>>>(
  () => undefined
);

const usePreviewCard = () => useContext(previewContext);
const useSetPreviewCard = () => useContext(setPreviewContext);


const PreviewProvider: FC<React.PropsWithChildren<{}>> = ({children}) => {
  const [preview, setPreview] = useState<CardType>({
    id: "",
    src: "",
    type: undefined,
  });
  return (
    <previewContext.Provider value={preview}>
      <setPreviewContext.Provider value={setPreview}>
        {children}
      </setPreviewContext.Provider>
    </previewContext.Provider>
  );
};

export { PreviewProvider, usePreviewCard, useSetPreviewCard };
