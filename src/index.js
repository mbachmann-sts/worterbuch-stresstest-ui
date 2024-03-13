import React from "react";
import ReactDOM from "react-dom/client";
import {
  Worterbuch,
  useLs,
  useSubscribe,
  useSubscribeLs,
} from "worterbuch-react";
import { List } from "react-virtualized";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

function App() {
  const config = {
    backendScheme: "ws",
    backendHost: "192.168.178.43",
    backendPort: "8080",
    backendPath: "/ws",
  };

  return (
    <Worterbuch automaticReconnect config={config}>
      <ItemList />
    </Worterbuch>
  );
}

function ItemList() {
  const blocksKey = "stagenetCustom/blocks";

  const blocks = useSubscribeLs(blocksKey);

  const rowKeys = [];
  if (blocks) {
    blocks.sort((a, b) => a.localeCompare(b, "en", { numeric: true }));
    for (const block of blocks) {
      rowKeys.push(`${blocksKey}/${block}/parameter/Delay/expectedValue`);
    }
  }

  const rowRenderer = ({ index, style }) => {
    return (
      <ListRow
        key={blocks[index]}
        block={blocks[index]}
        wbKey={rowKeys[index]}
        style={style}
      />
    );
  };

  return (
    <List
      width={300}
      height={300}
      rowCount={rowKeys.length}
      rowHeight={20}
      rowRenderer={rowRenderer}
    />
  );
}

function ListRow({ wbKey, block, style }) {
  const value = useSubscribe(wbKey);
  return (
    <div style={style}>
      {block}: {value}
    </div>
  );
}
