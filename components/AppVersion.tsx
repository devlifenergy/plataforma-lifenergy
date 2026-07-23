import packageJson from "@/package.json";

type AppVersionProps = { className?: string; prefix?: string };

export function AppVersion({ className, prefix = "Versão" }: AppVersionProps) {
  return <span className={className}>{prefix} {packageJson.version}</span>;
}
