export function ThemeScript() {
  const code = `
    try {
      var theme = localStorage.getItem("racehub:pref:theme") || "dark";
      document.documentElement.dataset.theme = theme === "light" ? "light" : "dark";
    } catch (_) {
      document.documentElement.dataset.theme = "dark";
    }
  `;

  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
