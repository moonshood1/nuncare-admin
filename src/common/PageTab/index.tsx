import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface PageTabprops {
  readonly icon: ReactNode;
  readonly title: string;
  readonly link: string;
  readonly linkTitle: string;
}

function PageTab({ icon, title, link, linkTitle }: PageTabprops) {
  return (
    <motion.div
      className="card bg-base-100 shadow flex flex-col items-center justify-center cursor-pointer p-4"
      whileHover={{ scale: 1.02 }}
    >
      <span className="my-4">{icon}</span>
      <h2 className="text-xl font-bold">{title}</h2>
      <Link to={link}>
        <h3 className="text-light underline italic text-sm mt-5">
          {linkTitle}
        </h3>
      </Link>
    </motion.div>
  );
}

export default PageTab;
