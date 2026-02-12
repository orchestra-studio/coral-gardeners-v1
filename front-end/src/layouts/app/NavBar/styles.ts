export const navStyles = {
  // Fixed positioned header
  header: "fixed top-0 left-0 right-0 z-50 flex justify-center select-none ",

  container: {
    base: "w-full max-w-[1400px] mx-auto px-4 md:px-8 backdrop-blur-md bg-[var(--surface)]/80 rounded-b-xl",
    scrolled: "w-full max-w-7xl mx-auto px-4",
    default: "w-full max-w-7xl mx-auto px-4"
  },

  nav: {
    base: "w-full bg-transparent",
    scrolled: "",
    default: "",
    shadows: {
      light: "none",
      dark: "none"
    }
  },

  content: {
    base: "flex items-center justify-between py-2",
    scrolled: "flex items-center justify-between py-2",
    default: "flex items-center justify-between py-2"
  },

  link: "cursor-pointer transition-opacity hover:opacity-70",
  button: "hover:opacity-70 transition-opacity"
};