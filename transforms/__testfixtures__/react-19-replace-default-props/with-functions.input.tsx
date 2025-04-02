const List = ({ items, renderItem }) => {
  return <ul>{items.map(renderItem)}</ul>;
};

List.defaultProps = {
  items: [],
  renderItem: (item) => <li key={item}>{item}</li>,
};
