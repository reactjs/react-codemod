const Link = ({ href = "#", children = "Click here", ...props }) => {
  return (
    <a href={href} {...props}>
      {children}
    </a>
  );
};
