import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import { ApperIcon } from "@/components/ApperIcon";

const DataTable = ({ columns, data, className, sortable = false }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const handleSort = (key) => {
    if (!sortable) return;
    
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = sortable && sortConfig.key ? 
    [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    }) : data;
  return (
    <motion.div
      className={cn("bg-white rounded-lg shadow-lg overflow-hidden", className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
{columns.map((column, index) => (
                <motion.th
                  key={column.key}
                  className={cn(
                    "px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider",
                    sortable && "cursor-pointer hover:bg-gray-200 transition-colors select-none"
                  )}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleSort(column.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.header}</span>
                    {sortable && (
                      <div className="flex flex-col">
                        <ApperIcon 
                          name="ChevronUp" 
                          size={12} 
                          className={cn(
                            "transition-colors",
                            sortConfig.key === column.key && sortConfig.direction === 'asc' 
                              ? "text-primary" 
                              : "text-gray-400"
                          )}
                        />
                        <ApperIcon 
                          name="ChevronDown" 
                          size={12} 
                          className={cn(
                            "transition-colors -mt-1",
                            sortConfig.key === column.key && sortConfig.direction === 'desc' 
                              ? "text-primary" 
                              : "text-gray-400"
                          )}
                        />
                      </div>
                    )}
                  </div>
                </motion.th>
              ))}
            </tr>
          </thead>
<tbody className="bg-white divide-y divide-gray-100">
            {sortedData.map((row, rowIndex) => (
              <motion.tr
                key={row.Id}
                className="hover:bg-gray-50 transition-colors duration-150"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: rowIndex * 0.05 }}
                whileHover={{ backgroundColor: "#f9fafb" }}
              >
                {columns.map((column, colIndex) => (
                  <td
                    key={`${row.Id}-${column.key}`}
                    className="px-6 py-4 whitespace-nowrap text-sm"
                  >
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default DataTable;