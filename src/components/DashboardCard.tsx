import { Link } from "react-router-dom";
import { ReactNode } from "react";
import { LoadingCircle } from "./LoadingCircle";

interface DashboardCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  link: string;
  color: string;
  isLoading: boolean;
}

export function DashboardCard({
  title,
  value,
  icon,
  link,
  color,
  isLoading,
}: Readonly<DashboardCardProps>) {
  return (
    <Link to={link} className="block">
      <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
        <div className="card-body">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="card-title text-base-content/70">{title}</h2>
              {isLoading ? (
                <LoadingCircle />
              ) : (
                <p className="text-3xl font-bold mt-2">
                  {value.toLocaleString()}
                </p>
              )}
            </div>
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center bg-${color}/10`}
            >
              {icon}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
