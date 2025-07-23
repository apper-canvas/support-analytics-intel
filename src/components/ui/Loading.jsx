import { motion } from "framer-motion";

const Loading = ({ type = "table" }) => {
  if (type === "table") {
    return (
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Table Header Skeleton */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
          <div className="flex space-x-8">
            {[...Array(5)].map((_, index) => (
              <motion.div
                key={index}
                className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse"
                style={{ width: `${80 + Math.random() * 40}px` }}
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            ))}
          </div>
        </div>

        {/* Table Rows Skeleton */}
        <div className="divide-y divide-gray-100">
          {[...Array(8)].map((_, rowIndex) => (
            <motion.div
              key={rowIndex}
              className="px-6 py-4 hover:bg-gray-50 transition-colors duration-150"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: rowIndex * 0.1 }}
            >
              <div className="flex space-x-8 items-center">
                {[...Array(5)].map((_, colIndex) => (
                  <motion.div
                    key={colIndex}
                    className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse"
                    style={{ 
                      width: colIndex === 0 ? "120px" : 
                             colIndex === 1 ? "180px" : 
                             colIndex === 2 ? "100px" : 
                             colIndex === 3 ? "140px" : "80px" 
                    }}
                    animate={{
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                      delay: colIndex * 0.2
                    }}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <motion.div
        className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full"
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </div>
  );
};

export default Loading;