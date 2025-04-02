function App({ url }: { url: string }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  return (
    <Context.Provider value={theme}>
    </Context.Provider>
  );
}
