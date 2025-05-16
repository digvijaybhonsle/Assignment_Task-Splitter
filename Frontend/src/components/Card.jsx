import React from "react";

const Card = ({ task }) => {
  if (!task) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white p-4 rounded-lg shadow-sm border transition-all duration-200 h-full flex flex-col justify-between hover:shadow-md"
    >
      <div className="space-y-2 text-sm text-gray-600 overflow-hidden">
        <h3 className="text-lg font-semibold text-gray-800 break-words">
          {task.firstName || "No Name"}
        </h3>
        <p>
          <span className="font-medium">Phone:</span> {task.Phone || "N/A"}
        </p>
        <p className="line-clamp-4">
          <span className="font-medium">Notes:</span> {task.Notes || "None"}
        </p>
      </div>
    </motion.div>
  );
};

export default Card;
