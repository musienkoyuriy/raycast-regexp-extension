export type Variation = {
  name: string;
  regexp: string;
};

export type ExpressionItem = {
  category: string;
  displayName: string;
  variations: Variation[];
};

export type MappedExpression = {
  category: string;
  name: string;
  regexp: string;
  id: string;
};