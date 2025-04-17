import { FC, ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

interface NavLinkProps {
  icon: ReactNode;
  label: string;
  url?: string;
  onClick?: () => void;
}

const SidebarNavLink: FC<NavLinkProps> = ({ icon, label, url, onClick }) => {
  const location = useLocation();
  const isActive =
    url === "/"
      ? location.pathname === "/"
      : location.pathname.startsWith(url + "/") || location.pathname === url;

  return (
    <motion.li
      className={`flex items-center gap-2 cursor-pointer p-2 ${
        isActive ? "border-l-4 border-nuncare-green" : "opacity-70"
      }`}
      whileHover={{ x: 8 }}
      onClick={onClick}
    >
      <Link to={{ pathname: url }} className="flex items-center gap-2">
        {icon} <span>{label}</span>{" "}
      </Link>
    </motion.li>
  );
};

export default SidebarNavLink;
