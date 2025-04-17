import { ReactNode } from "react";
import { PageTab } from "../common";

interface RoutesProps {
  id: string;
  title: string;
  icon: ReactNode;
  path: string;
  linkTitle: string;
}

interface LandingPageProps {
  title: string;
  description: string;
  routes: RoutesProps[];
}

export function LandingPageLayout({
  title,
  description,
  routes,
}: Readonly<LandingPageProps>) {
  return (
    <div className="flex flex-col h-screen p-10">
      <h1 className="text-3xl font-bold mb-4">{title}</h1>
      <p className="font-light text-sm">{description}</p>
      <section className="mt-4 flex flex-col md:grid md:grid-cols-2 gap-5">
        {routes.map((data) => (
          <PageTab
            title={data.title}
            key={data.id}
            icon={data.icon}
            link={data.path}
            linkTitle={data.linkTitle}
          />
        ))}
      </section>
    </div>
  );
}

export default LandingPageLayout;
