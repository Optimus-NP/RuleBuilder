export const DEFAULT_OPERATORS = ['=', '!=', '>', '<', '>=', '<='];

export const DEFAULT_OPERATOR = '=';

export const TYPE_TO_OPERATORS = [
  {type: 'integer', operator: ['=', '!=', '>', '<', '>=', '<=']},
  {type: 'enum', operator: ['in']}
];

export const TYPE_TO_OPERATORS_MAP = TYPE_TO_OPERATORS.reduce((acc, typeToOperator) => {
  acc[typeToOperator.type] = typeToOperator;
  return acc;
}, {});

export const SUPPORTED_RULE_CONDITIONS = [
  { name: 'Age', attribute: 'Employee Age', isMultiValued: false, type: 'integer', range: { min: 0, max: 120 } },
  { name: 'Salary', attribute: 'Employee Salary', isMultiValued: false, type: 'integer', range: { min: 0, max: 1000000 } },
  { name: 'Experience', attribute: 'Employee Experience in Days', isMultiValued: false, type: 'integer', range: { min: 0, max: 36500 } },
  { name: 'Department', attribute: 'Employee Department', isMultiValued: false, type: 'enum', options: ['Engineering', 'Marketing', 'Sales'] },
  { name: 'Skill', attribute: 'Employee Skill', isMultiValued: true, type: 'enum', options: ['JavaScript', 'Python', 'Shell'] },
];

export const SUPPORTED_RULE_CONDITIONS_MAP = SUPPORTED_RULE_CONDITIONS.reduce((acc, condition) => {
  acc[condition.name] = condition;
  return acc;
}, {});
