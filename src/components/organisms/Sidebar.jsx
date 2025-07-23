import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import SidebarLink from "@/components/molecules/SidebarLink";

const Sidebar = ({ isOpen, onClose, className }) => {
  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: "-100%" }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-grow bg-gradient-to-b from-secondary to-slate-800 overflow-y-auto shadow-xl">
          <div className="flex items-center flex-shrink-0 px-6 py-6 border-b border-slate-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <ApperIcon name="BarChart3" className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Support Analytics</h1>
                <p className="text-sm text-gray-300">Dashboard</p>
              </div>
            </div>
          </div>
          
          <nav className="flex-1 px-4 py-6 space-y-2">
            <SidebarLink to="/users" icon="Users">
              Users
            </SidebarLink>
            <SidebarLink to="/apps" icon="AppWindow">
              Apps
            </SidebarLink>
            <SidebarLink to="/logs" icon="FileText">
              AI Logs
            </SidebarLink>
          </nav>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        </motion.div>
      )}

      {/* Mobile Sidebar */}
      <motion.div
        className="fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-secondary to-slate-800 shadow-xl lg:hidden"
        variants={sidebarVariants}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          <div className="flex items-center justify-between flex-shrink-0 px-6 py-6 border-b border-slate-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <ApperIcon name="BarChart3" className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Support Analytics</h1>
                <p className="text-sm text-gray-300">Dashboard</p>
              </div>
            </div>
            <motion.button
              onClick={onClose}
              className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ApperIcon name="X" className="w-5 h-5" />
            </motion.button>
          </div>
          
          <nav className="flex-1 px-4 py-6 space-y-2">
            <SidebarLink to="/users" icon="Users">
              Users
            </SidebarLink>
            <SidebarLink to="/apps" icon="AppWindow">
              Apps
            </SidebarLink>
            <SidebarLink to="/logs" icon="FileText">
              AI Logs
            </SidebarLink>
          </nav>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;