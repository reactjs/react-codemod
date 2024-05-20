function App() {
  const [theme, setTheme] = useState('light');

  return (
    <Context value={theme}>
    <Page />
    </Context>
  );
}