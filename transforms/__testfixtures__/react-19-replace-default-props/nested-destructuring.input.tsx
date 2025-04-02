const Card = ({ user: { name, age } }) => {
  return (
    <div>
      <p>{name}</p>
      <p>{age}</p>
    </div>
  );
};

Card.defaultProps = {
  user: {
    name: "Unknown",
    age: 0,
  },
};
