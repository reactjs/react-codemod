const Span = ({ fontSize, children }) => {
  return <span style={{ fontSize }}>{children}</span>;
};

Span.defaultProps = {
  fontSize: "20px",
};
