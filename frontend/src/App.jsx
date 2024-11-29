import React, { useState } from 'react';
import RuleList from './RuleList';
import RuleBuilder from './RuleBuilder';

const App = () => {
  const [rules, setRules] = useState([]);
  const [editingRuleIndex, setEditingRuleIndex] = useState(null);
  const [conditionsToBeEdited, setConditionsToBeEdited] = useState([{ type: 'group', operator: 'AND', conditions: []}]);

  // Function to handle POST request to backend API
  const saveRuleToBackend = async (rule, name) => {
    try {
      const response = await fetch('http://localhost:3010/rules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rule: rule, id: name }),
      });

      if (!response.ok) {
        throw new Error('Failed to save rule to the backend.');
      }

      const data = await response.json();
      console.log('Rule saved successfully:', data);
    } catch (error) {
      console.error('Error saving rule:', error);
    }
  };

  const addRule = (rule, name) => {
    console.log("addRule got called. " + JSON.stringify(rule));
    if (editingRuleIndex !== null) {
      const updatedRules = [...rules];
      updatedRules[editingRuleIndex] = rule[0];
      updatedRules[editingRuleIndex].name = name;
      setRules(updatedRules);
      setEditingRuleIndex(null);
      setConditionsToBeEdited([{ type: 'group', operator: 'AND', conditions: []}]);
    } else {
      console.log("addRule got called to add new rule. " + JSON.stringify(rule));
      const newRuleToBeAdded = {...rule[0], name: name};
      setRules([...rules, newRuleToBeAdded]);
    }
    saveRuleToBackend(rule, name);
  };

  const editRule = (index) => {
    setEditingRuleIndex(index);
    setConditionsToBeEdited(rules[index]);
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Rule Engine Builder</h1>

      <div className="w-full max-w-4xl flex flex-col space-y-8">
        {/* Rule List */}
        <RuleList rules={rules} onEditRule={editRule} />

        {/* Rule Builder */}
        <RuleBuilder
          onSaveRule={addRule}
          conditionsToBeEdited={conditionsToBeEdited}
        />
      </div>
    </div>
  );
};

export default App;
