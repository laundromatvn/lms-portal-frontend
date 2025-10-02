import { theme } from "antd";

export function useTheme() {
  const { token } = theme.useToken();
  return token;
};