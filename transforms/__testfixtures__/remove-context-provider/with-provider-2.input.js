function App() {
  const [theme, setTheme] = useState('light');

  return (
    <Context.Provider value={theme}>
    </Context.Provider>
  );
}