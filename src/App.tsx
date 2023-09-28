import * as React from "react";
import styles from "./styles.module.scss";

const generateData = (categoriesQty: number, channelsQty: number) => {
  const categoriesArr = [];

  for (let i = 0; i < categoriesQty; i++) {
    categoriesArr.push({
      id: "category" + (i + 1),
      name: "Category " + (i + 1),
      image: "/someImage" + (i + 1),
      color: "#" + (((1 << 24) * Math.random()) | 0).toString(16),
      tabIndex: i + 1,
      channels: Array.from({ length: channelsQty }).map((channel, i) => ({
        id: "channel" + (i + 1),
        name: "Channel " + (i + 1),
        image: "/someChannelImage" + (i + 1),
        color: "#" + (((1 << 24) * Math.random()) | 0).toString(16),
        streamUrl: "/somelink"
      }))
    });
  }

  return { categories: categoriesArr };
};

const data = generateData(15, 12);

type ListItemProps = {
  name: string;
  id: string;
  color: string;
  onClick?: () => void;
  onKeyPress?: () => void;
  size: number;
  hasFocus?: boolean;
};
///
const ListItem = React.memo(
  ({
    name,
    id,
    color,
    onClick,
    onKeyPress,
    size = 80,
    hasFocus
  }: ListItemProps) => {
    console.log(hasFocus ? styles["categoryItem--active"] : "");
    return (
      <div
        id={id}
        tabIndex={1}
        onClick={onClick}
        onKeyPress={onKeyPress}
        className={`${styles.categoryItem} ${
          hasFocus ? styles["categoryItem--active"] : ""
        }`}
        style={{
          backgroundColor: color,
          minWidth: `${size}px`,
          minHeight: `${size}px`
        }}
      >
        {name}
      </div>
    );
  }
);
///
const App: React.FC = () => {
  const verticalRef = React.useRef<HTMLDivElement>(null);
  const horizontalRef = React.useRef<HTMLDivElement>(null);
  const [catIdx, setCatIdx] = React.useState(0);
  const [channelIdx, setChannelIdx] = React.useState(-1);
  const channelRef = React.useRef(-1);

  React.useEffect(() => {
    if (channelIdx < 0) {
      document.getElementById(data.categories[catIdx].id)?.focus();
    } else {
      document
        .getElementById(
          data.categories[catIdx].channels[channelIdx < 0 ? 0 : channelIdx].id
        )
        ?.focus();
    }

    const handleKeyPress = (e) => {
      e.preventDefault();
      if (e.keyCode === 38) {
        //top
        setCatIdx((prev) => (prev > 0 ? prev - 1 : prev));
      }
      if (e.keyCode === 40) {
        //down
        setCatIdx((prev) =>
          prev + 1 < data.categories.length ? prev + 1 : prev
        );
      }
      if (e.keyCode === 37) {
        //left
        setChannelIdx((prev) => (prev < 0 ? prev : prev - 1));
      }
      if (e.keyCode === 39 || e.keyCode === 13) {
        //right
        setChannelIdx((prev) =>
          prev + 1 < data.categories[catIdx].channels.length ? prev + 1 : prev
        );
      }
      if (e.keyCode === 9) {
        //if (verticalRef.current) verticalRef.current.focus();
        if (channelIdx >= 0) {
          channelRef.current = channelIdx;
          setChannelIdx(-1);
        } else {
          setChannelIdx(0);
        }
      }
    };
    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [catIdx, channelIdx]);

  return (
    <div className={styles.App}>
      <div
        className={styles.verticalContainer}
        onFocus={() => console.log("focus vertical")}
        ref={verticalRef}
        tabIndex={0}
      >
        {data.categories.map((category, idx) => (
          <ListItem
            key={category.id}
            color={category.color}
            id={category.id}
            name={category.name}
            size={80}
            hasFocus={catIdx === idx}
          />
        ))}
      </div>
      <div
        className={styles.mainViewContainer}
        style={{
          backgroundColor:
            catIdx >= 0 && channelIdx >= 0
              ? data.categories[catIdx].channels[channelIdx].color
              : ""
        }}
      >
        {catIdx >= 0 && channelIdx >= 0
          ? data.categories[catIdx].channels[channelIdx].name
          : "No channel"}
      </div>
      <div
        className={styles.horizontalContainer}
        ref={horizontalRef}
        onFocus={() => console.log("focus vertical")}
        tabIndex={0}
      >
        {data.categories[catIdx].channels.map((channel) => {
          return (
            <ListItem
              key={channel.id}
              color={channel.color}
              id={channel.id}
              name={channel.name}
              size={130}
            />
          );
        })}
      </div>
    </div>
  );
};

export default App;
///
