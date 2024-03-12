import React from "react";
import ReactDOM from "react-dom/client";
import { Worterbuch, useSubscribe } from "worterbuch-react";
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
    backendHost: "thinkpad-p14s",
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
  const rowKeys = [];
  for (let i = 0; i < 1_000; i++) {
    rowKeys.push("worterbuch-virtualized/" + i);
  }

  const rowRenderer = ({ key, index, style }) => {
    return (
      <ListRow key={key} wbKey={rowKeys[index]} style={style} index={index} />
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

function ListRow({ wbKey, index, style }) {
  const value = useSubscribe(wbKey);
  return (
    <div style={style}>
      {index}: {value}
    </div>
  );
}
