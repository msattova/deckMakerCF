import Markdown from "react-markdown";
import rule_md from "./rule.md?raw"
import { Link } from "react-router-dom";



function Rule(){
  return (
    <div style={
      {margin: "4px 8px"}
      }>
      <Link to={"/"}>デッキメーカー画面に戻る</Link>
      <Markdown>{rule_md}</Markdown>
    </div>
  );
}

export default Rule ;
