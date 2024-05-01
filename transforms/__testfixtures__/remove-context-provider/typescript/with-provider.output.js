function App({ url }: { url: string }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  return (
    <ThemeContext value={theme}>
      <Page />
    </ThemeContext>
  );
}