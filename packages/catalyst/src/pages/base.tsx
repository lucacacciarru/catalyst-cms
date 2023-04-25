import { CatalystAuth, CatalystConfig } from "../types";
import { redirect } from "next/navigation";
import { Logo } from "../components/Logo";
import { CurrentSubrouteLink } from "../components/CurrentSubrouteLink";

type IndexPageProps = {
  config: CatalystConfig;
  auth: CatalystAuth;
};

export async function IndexPage({ config, auth }: IndexPageProps) {
  const session = await auth.getServerSession();

  if (!session) {
    redirect("/catalyst/login");
  }

  return (
    <div className="flex flex-col bg-gray-100 p-16 h-full">
      <div className="flex items-center gap-2 mb-8">
        <Logo className="w-11 h-11" />
        <h1 className="text-red-600 font-black text-4xl">CATALYST</h1>
      </div>

      <div className="flex flex-col">
        <span className="font-semibold text-gray-500 mb-1">Collections</span>
        <div className="flex flex-col gap-2">
          {Object.entries(config.collections).map(([key, collection]) => (
            <CurrentSubrouteLink
              key={key}
              href={`browse/${key}`}
              className="p-4 flex flex-col gap-4 font-semibold text-gray-700 border border-gray-300 rounded bg-white hover:border-gray-400"
            >
              {collection.label}
            </CurrentSubrouteLink>
          ))}
        </div>
      </div>
    </div>
  );
}
