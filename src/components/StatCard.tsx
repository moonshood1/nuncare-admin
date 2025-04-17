import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { LoadingCircle } from "./LoadingCircle";

interface CardProps {
  value: number;
  title: string;
  link: string;
  color?: string;
  icon: ReactNode;
  isLoading?: boolean;
}

export function StatCard({
  value,
  title,
  link,
  color,
  icon,
  isLoading,
}: Readonly<CardProps>) {
  return (
    <Link to={link}>
      <motion.div
        className={`card bg-base-100 shadow-md cursor-pointer text-center shadow-${color}-100`}
        whileHover={{ scale: 1.05 }}
      >
        <div className="card-body flex flex-col items-center text-center justify-center">
          {isLoading ? (
            <LoadingCircle />
          ) : (
            <>
              <span>{icon}</span>
              <h2 className=" text-md font-light">{title}</h2>
              <h4 className="text-xl font-bold">{value}</h4>
            </>
          )}
        </div>
      </motion.div>
    </Link>
  );
}
