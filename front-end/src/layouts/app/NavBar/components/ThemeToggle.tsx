import { useTheme } from "@/providers/ThemeProvider";
import { IconMoon, IconSun } from "@tabler/icons-react";
import IconButton from "@/components/ui/iconButton";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <IconButton
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="focus:outline-none focus:ring-0"
    >
      {theme === "dark" ? (
        <IconSun className="w-4 h-4" />
      ) : (
        <IconMoon className="w-4 h-4" />
      )}
    </IconButton>
  );
};
