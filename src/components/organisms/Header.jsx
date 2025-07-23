import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Header = ({ onMenuClick, title = "Dashboard" }) => {
  return (
    <motion.header
      className="bg-white shadow-sm border-b border-gray-200 lg:ml-64"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden p-2"
          >
            <ApperIcon name="Menu" className="w-5 h-5" />
          </Button>
          
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              {title}
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Monitor and analyze support operations
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <motion.div
            className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ApperIcon name="User" className="w-4 h-4 text-white" />
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;