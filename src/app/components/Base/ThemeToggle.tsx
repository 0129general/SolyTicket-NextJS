// components/ThemeToggle.tsx
import { useContext } from "react";
import ThemeContext from "@/app/context/ThemeContext";
import { FaSun, FaMoon } from "react-icons/fa";

const ThemeToggle: React.FC = () => {
  const themeContext = useContext(ThemeContext);

  if (!themeContext) {
    throw new Error("ThemeContext must be used within a ThemeProvider");
  }

  const { theme, toggleTheme } = themeContext;

  return (
    <div className="flex items-center justify-center">
      <div
        className="relative inline-block w-16 h-8 transition duration-200 ease-linear rounded-full"
        onClick={toggleTheme}
      >
        <div className="block w-full h-full rounded-full bg-gray-300 dark:bg-gray-600"></div>
        <div
          className={`absolute left-1 top-1 w-6 h-6 bg-white rounded-full transition-transform duration-200 ease-linear ${theme === "dark" ? "transform translate-x-8" : ""
            } flex items-center justify-center`}
        >
          {theme === "light" ? (
            <FaSun className="text-yellow-500" />
          ) : (
            <FaMoon className="text-blue-500" />
          )}
        </div>
      </div>
    </div>
  );
};

export default ThemeToggle;
