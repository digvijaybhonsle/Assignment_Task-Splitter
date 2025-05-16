import React from "react";
import { motion } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05 },
  }),
};

// A palette of color themes
const COLORS = [
  {
    cardBg: "bg-blue-50",
    cardBorder: "border-blue-200",
    headerText: "text-blue-600",
    taskBg: "bg-blue-100",
    taskBorder: "border-blue-300",
  },
  {
    cardBg: "bg-green-50",
    cardBorder: "border-green-200",
    headerText: "text-green-600",
    taskBg: "bg-green-100",
    taskBorder: "border-green-300",
  },
  {
    cardBg: "bg-yellow-50",
    cardBorder: "border-yellow-200",
    headerText: "text-yellow-600",
    taskBg: "bg-yellow-100",
    taskBorder: "border-yellow-300",
  },
  {
    cardBg: "bg-pink-50",
    cardBorder: "border-pink-200",
    headerText: "text-pink-600",
    taskBg: "bg-pink-100",
    taskBorder: "border-pink-300",
  },
  {
    cardBg: "bg-purple-50",
    cardBorder: "border-purple-200",
    headerText: "text-purple-600",
    taskBg: "bg-purple-100",
    taskBorder: "border-purple-300",
  },
];

const DistributedList = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-10">
        No data available. Upload a valid CSV first.
      </div>
    );
  }

  // Group tasks by agent
  const grouped = data.reduce((acc, item) => {
    const agentId = item.agent?._id || item.agent;
    if (!acc[agentId]) {
      acc[agentId] = {
        agentName: item.agent?.name || "Unknown",
        tasks: [],
      };
    }
    acc[agentId].tasks.push({
      firstName: item.firstName,
      phone: item.phone,
      notes: item.notes,
    });
    return acc;
  }, {});

  const groups = Object.entries(grouped).map(([id, group]) => ({
    agentId: id,
    agentName: group.agentName,
    tasks: group.tasks,
  }));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
      {groups.map((group, index) => {
        const color = COLORS[index % COLORS.length];
        return (
          <motion.div
            key={group.agentId}
            className={`p-4 rounded-xl shadow-md border flex flex-col ${color.cardBg} ${color.cardBorder}`}
            initial="hidden"
            animate="visible"
            custom={index}
            variants={cardVariants}
          >
            <h2 className={`text-lg font-bold mb-3 ${color.headerText}`}>
              {group.agentName}
            </h2>
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {group.tasks.length === 0 ? (
                <p className="text-sm text-gray-500">No tasks assigned</p>
              ) : (
                group.tasks.map((task, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg border ${color.taskBg} ${color.taskBorder}`}
                  >
                    <p className="font-medium text-gray-800">
                      {task.firstName}
                    </p>
                    <p className="text-sm text-gray-600">
                      Phone: {task.phone || "N/A"}
                    </p>
                    <p className="text-sm text-gray-600">
                      Notes: {task.notes || "None"}
                    </p>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default DistributedList;
