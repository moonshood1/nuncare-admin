import { Link, useLocation } from "react-router-dom";
import { appRoutes } from "../../Routes";

function BreadcrumbsNav() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter(Boolean);

  const getLabelForPath = (path: string) => {
    const route = appRoutes.find((r) => r.path === path);
    return route ? route.label : path;
  };

  return (
    <div className="breadcrumbs text-sm">
      <ul>
        <li>
          <Link to="/">Accueil</Link>
        </li>
        {pathnames.map((_, index) => {
          const path = "/" + pathnames.slice(0, index + 1).join("/");
          const label = getLabelForPath(path);

          const isLast = index === pathnames.length - 1;
          return (
            <li key={path}>
              {isLast ? <span>{label}</span> : <Link to={path}>{label}</Link>}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default BreadcrumbsNav;
