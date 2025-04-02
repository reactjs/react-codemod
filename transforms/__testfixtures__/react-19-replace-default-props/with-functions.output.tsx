const listDefaultPropItems = [];
const listDefaultPropRenderItem = (item) => <li key={item}>{item}</li>;
const List = ({ items = listDefaultPropItems, renderItem = listDefaultPropRenderItem }) => {
  return <ul>{items.map(renderItem)}</ul>;
};
