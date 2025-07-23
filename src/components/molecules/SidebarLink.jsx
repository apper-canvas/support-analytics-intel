import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const SidebarLink = ({ to, icon, children, className }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative",
          isActive
            ? "bg-primary text-white shadow-lg"
            : "text-gray-300 hover:text-white hover:bg-white/10",
          className
        )
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-lg"
              layoutId="activeTab"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          <div className="relative z-10 flex items-center space-x-3">
            <ApperIcon 
              name={icon} 
              className={cn(
                "w-5 h-5 transition-colors duration-200",
                isActive ? "text-white" : "text-gray-400 group-hover:text-white"
              )} 
            />
            <span>{children}</span>
          </div>
        </>
      )}
    </NavLink>
  );
};

export default SidebarLink;