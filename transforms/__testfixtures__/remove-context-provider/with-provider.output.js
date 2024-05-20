function App() {
  const [theme, setTheme] = useState('light');

  return (
    <ThemeContext value={theme}>
      <Page />
    </ThemeContext>
  );
}