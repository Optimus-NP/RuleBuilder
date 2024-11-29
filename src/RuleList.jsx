import React, { useEffect } from 'react';

const RuleList = ({ rules, onEditRule }) => {

  useEffect(() => {console.log("onEffect in RuleList: " + rules.length);}, [rules]);

  // Recursive function to render conditions and nested groups
  const renderConditions = (rules) => {
    // Add a safeguard to ensure conditions is always an array
    if (!rules || rules.length === 0) {
      console.log('No conditions to render for this group.');
      return <div className="text-gray-500 italic">No conditions</div>; // Informative message for empty conditions
    }

    return rules.map((condition, index) => {
      if (condition.type === 'group') {
        return (
          <div key={index} className="ml-6 mt-2 p-2 border-l border-gray-300">
            <strong>Group</strong> ({condition.operator})
            <div className="ml-4 mt-2">
              {renderConditions(condition.conditions)}
            </div>
          </div>
        );
      } else {
        return (
          <div key={index} className="mt-2">
            <span className="text-blue-500">{condition.field}</span> {" "}
            {condition.operator} {" "}
            {condition.value && <span className="text-red-500">{condition.value}</span>}
            {condition.values && condition.values.length > 0 && (
              <span className="text-red-500">{condition.values.join(', ')}</span>
            )}
          </div>
        );
      }
    });
  };

  return (
    <div className="bg-white shadow-md rounded-md p-4">
      <h3 className="text-lg font-bold mb-4">Rules</h3>
      <ul className="list-disc ml-6">
        {rules.length === 0 ? (
          <li>No rules defined</li>
        ) : (
          rules.map((rule, index) => (
            <li key={index} className="mb-4">
              <div className="flex justify-between">
                <strong className="text-xl text-indigo-600">{rule.name}</strong>
                <button
                  onClick={() => onEditRule(index)}
                  className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-1 px-2 rounded"
                >
                  Edit
                </button>
              </div>
              <div className="ml-4 mt-2">
                {rule.conditions && rule.conditions.length > 0 ? (
                  renderConditions([rule])
                ) : (
                  <div className="text-gray-500 italic">No conditions in this rule</div>
                )}
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default RuleList;
