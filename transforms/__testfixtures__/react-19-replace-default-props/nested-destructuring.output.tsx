const cardDefaultPropUser = {
  name: "Unknown",
  age: 0,
};

const Card = ({ user: { name, age } = cardDefaultPropUser }) => {
  return (
    <div>
      <p>{name}</p>
      <p>{age}</p>
    </div>
  );
};
