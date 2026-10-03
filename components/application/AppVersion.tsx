import packageJson from "@/package.json";

type AppVersionProps = {
  prefix?: string;
};

export function AppVersion({ prefix = "Versão" }: AppVersionProps) {
  return <>{prefix} {packageJson.version}</>;
}
