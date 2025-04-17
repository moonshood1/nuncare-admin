import BreadcrumbsNav from "../BreadCrumbsNav";
import NavbarNavLink from "./components/NavbarLink";
import { navbarNavData } from "./components/NavbarLinkData";

function Navbar() {
  return (
    <div className="w-full border-b-2 border-nuncare-green p-4 flex flex-row">
      <BreadcrumbsNav />
      <section className="ml-auto">
        <ul className="flex gap-6 text-gray-700">
          {navbarNavData.map((data) => (
            <NavbarNavLink
              key={data.id}
              icon={data.icon}
              label={data.label}
              url={data.url}
            />
          ))}
        </ul>
      </section>
    </div>
  );
}

export default Navbar;
