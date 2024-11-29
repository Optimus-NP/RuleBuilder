import React, { useEffect, useState } from 'react';
import DropdownInput from './DropdownInput';
import { SUPPORTED_RULE_CONDITIONS, SUPPORTED_RULE_CONDITIONS_MAP, TYPE_TO_OPERATORS_MAP } from './conditions';
import IntegerInput from './IntegerInput';
import CheckboxGroupInput from './CheckboxGroupInput';

const RuleBuilder = ({ onSaveRule, conditionsToBeEdited }) => {
  // Helper: Deep clone a nested object
  const deepClone = (obj) => {
    return JSON.parse(JSON.stringify(obj));
  };

  // State for rule name and conditions
  const [name, setName] = useState('');
  const [conditions, setConditions] = useState(conditionsToBeEdited);

  const validateConditions = (groupConditions) => {
    for (const condition of groupConditions) {
      if (condition.type === 'group') {
        // Recursively validate nested groups
        if ((condition.operator !== 'AND' && condition.operator !== 'OR') || !validateConditions(condition.conditions)) {
          return false;
        }
      } else {
        // Check that 'field', 'operator', and 'value' (or 'values') are properly set        
        if (!condition.field || !condition.operator || 
          (SUPPORTED_RULE_CONDITIONS_MAP[condition.field]['type'] === 'integer' && 
              (condition.value === '' || 
              parseInt(condition.value) > SUPPORTED_RULE_CONDITIONS_MAP[condition.field]['range']['max'] || 
              parseInt(condition.value) < SUPPORTED_RULE_CONDITIONS_MAP[condition.field]['range']['min'])) ||
          (SUPPORTED_RULE_CONDITIONS_MAP[condition.field]['type'] === 'enum' && 
              !SUPPORTED_RULE_CONDITIONS_MAP[condition.field]['isMultiValued'] && 
              (condition.value === '' || !SUPPORTED_RULE_CONDITIONS_MAP[condition.field]['options'].includes(condition.value))) ||    
          (SUPPORTED_RULE_CONDITIONS_MAP[condition.field]['type'] === 'enum' && 
              SUPPORTED_RULE_CONDITIONS_MAP[condition.field]['isMultiValued'] &&
              (condition.values.length === 0 || 
                condition.values.some(item => !SUPPORTED_RULE_CONDITIONS_MAP[condition.field]['options'].includes(item))))) {
          return false;
        }
      }
    }
    return true; // All conditions are valid
  };

  useEffect(() => {
    console.log(JSON.stringify(conditions));
    /* if (validateConditions(conditions)) {
      console.log("conditions are valid.");
      setIsSaveButtonDisabled(false)
    } else {
      console.log("conditions are valid.");
    } */
  }, [conditions]);

  const resetConditions = () => {
    setConditions([{ type: 'group', operator: 'AND', conditions: [] }]);
    setName('');
  };

  const callOnSaveRule = () => {
    if (validateConditions(conditions)) {
      console.log("callOnSaveRule was called.. " + JSON.stringify(conditions));
      onSaveRule(deepClone(conditions), name);
      resetConditions();
    } else {
      alert("Rule isn't valid.");
    }
    
  };



  // Add new condition to the specified group
  const addCondition = (groupPath) => {
    const updatedConditions = deepClone(conditions);
    let currentGroup = updatedConditions;

    groupPath.forEach((index) => {
      currentGroup = currentGroup[index].conditions;
    });

    currentGroup.push({ field: '', operator: '', value: '', values: [] });
    setConditions(updatedConditions);

  };

  // Add nested group to the specified group
  const addGroup = (groupPath) => {
    const updatedConditions = deepClone(conditions);
    let currentGroup = updatedConditions;

    groupPath.forEach((index) => {
      currentGroup = currentGroup[index].conditions;
    });

    currentGroup.push({ type: 'group', operator: 'AND', conditions: [] });
    setConditions(updatedConditions);
  };

  // Update specific condition in the group or nested group
  const updateCondition = (groupPath, conditionIndex, updatedCondition) => {
    const updatedConditions = deepClone(conditions);
    let currentGroup = updatedConditions;

    groupPath.forEach((index) => {
      currentGroup = currentGroup[index].conditions;
    });

    currentGroup[conditionIndex] = updatedCondition;
    setConditions(updatedConditions);

  };

  // Render conditions recursively
  const renderConditions = (group, groupPath) => {
    return group.conditions.map((condition, index) => {
      const newGroupPath = [...groupPath, index]; // Keep track of the path to the nested group

      if (condition.type === 'group') {
        return (
          <div key={index} className="ml-4 border-l-2 pl-4">
            <div className="flex items-center space-x-2 mb-2">
              <span className="font-bold">Nested Group</span>
              <select
                className="border border-gray-300 p-1 rounded-md"
                value={condition.operator}
                onChange={(e) => {
                  const updatedGroup = { ...condition, operator: e.target.value };
                  updateCondition(groupPath, index, updatedGroup);
                }}
              >
                <option value="AND">AND</option>
                <option value="OR">OR</option>
              </select>
            </div>
            {renderConditions(condition, newGroupPath)}
            <button
              onClick={() => addCondition(newGroupPath)}
              className="bg-blue-500 text-white px-3 py-1 rounded-md mt-2"
            >
              Add Condition
            </button>
            <button
              onClick={() => addGroup(newGroupPath)}
              className="bg-green-500 text-white px-3 py-1 rounded-md mt-2 ml-2"
            >
              Add Nested Group
            </button>
          </div>
        );
      }

      return (
        <div key={index} className="flex space-x-2 mt-2">
          {/* Field dropdown */}
          <DropdownInput
            label="Condition"
            options={SUPPORTED_RULE_CONDITIONS.map((cond) => cond.name)}
            value={condition.field}
            onChange={(e) => {
              const updatedCondition = { ...condition, field: e.target.value, operator: '', value: '', values: [] };
              updateCondition(groupPath, index, updatedCondition);
            }}
          />

          {/* Operator dropdown */}
          {condition.field && (
            <DropdownInput
              label="Operator"
              options={TYPE_TO_OPERATORS_MAP[SUPPORTED_RULE_CONDITIONS_MAP[condition.field]['type']]['operator']}
              value={condition.operator}
              onChange={(e) => {
                const updatedCondition = { ...condition, operator: e.target.value };
                updateCondition(groupPath, index, updatedCondition);
              }}
              disabled={!condition.field}
            />
          )}

          {/* Value input */}
          {condition.field && SUPPORTED_RULE_CONDITIONS_MAP[condition.field]['type'] === 'integer' && (
            <IntegerInput
              label={SUPPORTED_RULE_CONDITIONS_MAP[condition.field]['name']}
              min={SUPPORTED_RULE_CONDITIONS_MAP[condition.field]['range']['min']}
              max={SUPPORTED_RULE_CONDITIONS_MAP[condition.field]['range']['max']}
              value={condition.value}
              onChange={(e) => {
                const updatedCondition = { ...condition, value: e.target.value };
                updateCondition(groupPath, index, updatedCondition);
              }}
              disabled={!condition.operator}
            />
          )}

          {condition.field &&
            SUPPORTED_RULE_CONDITIONS_MAP[condition.field]['type'] === 'enum' &&
            SUPPORTED_RULE_CONDITIONS_MAP[condition.field]['isMultiValued'] === false && (
              <DropdownInput
                label={SUPPORTED_RULE_CONDITIONS_MAP[condition.field]['name']}
                options={SUPPORTED_RULE_CONDITIONS_MAP[condition.field]['options']}
                value={condition.value}
                onChange={(e) => {
                  const updatedCondition = { ...condition, value: e.target.value };
                  updateCondition(groupPath, index, updatedCondition);
                }}
              />
            )}

          {condition.field &&
            SUPPORTED_RULE_CONDITIONS_MAP[condition.field]['type'] === 'enum' &&
            SUPPORTED_RULE_CONDITIONS_MAP[condition.field]['isMultiValued'] === true && (
              <CheckboxGroupInput
                label={SUPPORTED_RULE_CONDITIONS_MAP[condition.field]['name']}
                options={SUPPORTED_RULE_CONDITIONS_MAP[condition.field]['options']}
                selectedOptions={condition.values}
                onChange={(e) => {
                  const prevValues = condition.values;
                  const newValues = prevValues.includes(e)
                    ? prevValues.filter((s) => s !== e)
                    : [...prevValues, e];
                  const updatedCondition = { ...condition, values: newValues };
                  updateCondition(groupPath, index, updatedCondition);
                }}
              />
            )}
        </div>
      );
    });
  };

  return (
    <div className="bg-white shadow-md rounded-md p-4 mt-6">
      <h3 className="text-lg font-bold mb-4">Build a Rule</h3>
      <input
        type="text"
        placeholder="Rule Name"
        className="border border-gray-300 p-2 w-full rounded-md mb-4"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      {conditions.map((group, index) => (
        <div key={index}>
          <h4 className="text-md font-semibold">Group {index + 1}</h4>
          <select
            className="border border-gray-300 p-1 mr-2 rounded-md mb-2"
            value={group.operator}
            onChange={(e) => {
              const newConditions = [...conditions];
              newConditions[index].operator = e.target.value;
              setConditions(newConditions);
            }}
          >
            <option value="AND">AND</option>
            <option value="OR">OR</option>
          </select>
          {renderConditions(group, [index])}
          <button
            onClick={() => addCondition([index])}
            className="bg-blue-500 text-white px-3 py-1 rounded-md mt-2"
          >
            Add Condition
          </button>
          <button
            onClick={() => addGroup([index])}
            className="bg-green-500 text-white px-3 py-1 rounded-md mt-2 ml-2"
          >
            Add Nested Group
          </button>
        </div>
      ))}
      <button onClick={callOnSaveRule} className="bg-purple-500 text-white px-4 py-2 rounded-md mt-4">
        Save Rule
      </button>
    </div>
  );
};

export default RuleBuilder;
