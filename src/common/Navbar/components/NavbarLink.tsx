import { FC, ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";

interface NavLinkProps {
  icon: ReactNode;
  label: string;
  url?: string;
  onClick?: () => void;
}

const NavbarNavLink: FC<NavLinkProps> = ({ icon, label, url, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === url;

  return (
    <li
      className={`flex items-center gap-2 cursor-pointer p-2 hover:text-nuncare-green ${
        isActive ? "text-nuncare-green" : "opacity-70"
      }`}
      onClick={onClick}
    >
      <Link to={{ pathname: url }} className="flex items-center gap-2">
        {icon} <span>{label}</span>{" "}
      </Link>
    </li>
  );
};

export default NavbarNavLink;
