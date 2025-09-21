import { HighContrastTheme, NormalTheme, type Theme } from "@/lib/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

type Settings = { themeName: "normal" | "high-contrast"; textScale: number };
const defaultSettings: Settings = { themeName: "normal", textScale: 1 };
const STORAGE_KEY = "settings";

const Ctx = createContext<{
  theme: Theme;
  settings: Settings;
  setThemeName: (name: Settings["themeName"]) => void;
  setTextScale: (scale: number) => void;
}>({
  theme: NormalTheme,
  settings: defaultSettings,
  setThemeName: () => {},
  setTextScale: () => {},
});

export const useSettings = () => useContext(Ctx);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(
      (s) => s && setSettings(JSON.parse(s))
    );
  }, []);
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings)).catch(() => {});
  }, [settings]);

  const theme = useMemo(
    () =>
      settings.themeName === "high-contrast" ? HighContrastTheme : NormalTheme,
    [settings.themeName]
  );
  return (
    <Ctx.Provider
      value={{
        theme,
        settings,
        setThemeName: (name) => setSettings((s) => ({ ...s, themeName: name })),
        setTextScale: (scale) =>
          setSettings((s) => ({
            ...s,
            textScale: Math.min(1.75, Math.max(0.75, scale)),
          })),
      }}
    >
      {children}
    </Ctx.Provider>
  );
};
