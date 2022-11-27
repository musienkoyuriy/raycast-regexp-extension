export type Variation = {
  name: string;
  regexp: string;
  link?: string;
};

export type ExpressionItem = {
  category: string;
  displayName: string;
  variations: Variation[];
};

export type Category = {
  shortname: string;
  displayName: string;
};

export type MappedExpression = {
  category: string;
  displayName: string;
  name: string;
  regexp?: string;
  link?: string;
  id: string;
};
