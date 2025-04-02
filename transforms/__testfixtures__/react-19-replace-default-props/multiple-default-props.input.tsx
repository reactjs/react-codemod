const Button = ({ size, color }) => {
  return <button style={{ color, fontSize: size }}>Click me</button>;
};

Button.defaultProps = {
  size: "16px",
  color: "blue",
};
