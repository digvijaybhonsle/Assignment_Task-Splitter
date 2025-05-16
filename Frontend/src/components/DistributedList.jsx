import React from "react";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05 },
  }),
};

/**
 * Expects `data` as a flat array of task objects with `agent` field:
 * [ { agent: { _id, name }, firstName, phone, notes, ... }, ... ]
 */
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
    const agentId = item.agent?._id || item.agent; // handle populated or just IDs
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
      {groups.map((group, index) => (
        <motion.div
          key={group.agentId}
          className="bg-white p-4 rounded-xl shadow-md border flex flex-col"
          initial="hidden"
          animate="visible"
          custom={index}
          variants={cardVariants}
        >
          <h2 className="text-lg font-bold text-indigo-600 mb-3">
            {group.agentName}
          </h2>
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {group.tasks.length === 0 ? (
              <p className="text-sm text-gray-500">No tasks assigned</p>
            ) : (
              group.tasks.map((task, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <p className="font-medium text-gray-800">{task.firstName}</p>
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
      ))}
    </div>
  );
};

export default DistributedList;
