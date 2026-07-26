type AppVersionProps = {
  prefix?: string;
};

export function AppVersion({ prefix = "Versão" }: AppVersionProps) {
  const version = process.env.NEXT_PUBLIC_APP_VERSION ?? "não informada";
  return <>{prefix} {version}</>;
}
