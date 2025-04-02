const Link = ({ href, children, ...props }) => {
  return (
    <a href={href} {...props}>
      {children}
    </a>
  );
};

Link.defaultProps = {
  href: "#",
  children: "Click here",
};
