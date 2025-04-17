import { LogOut } from "lucide-react";
import SidebarNavLink from "./components/SidebarNavLink";
import { sidebarNavData } from "./components/SidebarNavLinkData";
import { useAuth } from "../../AuthProvider";

function Sidebar() {
  const { logout } = useAuth();

  return (
    <div className="h-full shadow-lg p-3 flex flex-col justify-between bg-base-100">
      <section className="flex flex-col items-center justify-center text-center py-6">
        <img src="/logo.png" alt="Nuncare-logo" className="max-w-12" />
        <h1 className="text-3xl font-bold">Nuncare</h1>
      </section>

      <section className="flex-1 py-4">
        <ul className="space-y-2">
          {sidebarNavData.map((data) => (
            <SidebarNavLink
              key={data.id}
              icon={data.icon}
              label={data.label}
              url={data.url}
            />
          ))}
        </ul>
      </section>

      <section className="py-4">
        <SidebarNavLink
          icon={<LogOut />}
          label={"Déconnexion"}
          onClick={logout}
        />
      </section>
    </div>
  );
}

export default Sidebar;
