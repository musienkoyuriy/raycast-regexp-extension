import { useState, useEffect } from "react";
import expressionsJSON from "../../assets/expressions.json";
import useMemoizedFn from "./useMemoizedFn";
import { nanoid } from "nanoid";
import { Category, ExpressionItem, MappedExpression } from "../types";

const flatExpressions = (
  expressions: ExpressionItem[]
): {
  zipCodesExpressions: MappedExpression[];
  defaultExpressions: MappedExpression[];
  regexpCategories: Category[];
} => {
  let defaultExpressions: MappedExpression[] = [];
  let zipCodesExpressions: MappedExpression[] = [];
  const categories: Category[] = [];

  for (const expression of expressions) {
    categories.push({
      shortname: expression.category,
      displayName: expression.displayName,
    });
    if (expression.category !== "zipcode") {
      defaultExpressions = [...defaultExpressions, ...processExpressionVariations(expression)];
    } else {
      zipCodesExpressions = [...zipCodesExpressions, ...processExpressionVariations(expression)];
    }
  }

  if (zipCodesExpressions.length) {
    defaultExpressions = [
      ...defaultExpressions,
      ...[
        {
          name: "Zip Codes",
          category: "zipcode",
          displayName: "Zip Codes",
          id: nanoid(5),
        },
      ],
    ];
  }
  return {
    defaultExpressions,
    zipCodesExpressions,
    regexpCategories: [
      {
        shortname: "all",
        displayName: "All",
      },
      ...categories,
    ],
  };
};

function processExpressionVariations(expressionItem: ExpressionItem): MappedExpression[] {
  return expressionItem.variations.map(({ name, regexp, link }) => ({
    name,
    regexp,
    link,
    category: expressionItem.category,
    displayName: expressionItem.displayName,
    id: nanoid(5),
  }));
}

export default function useExpressionsStore(): {
  zipCodesExpressions: MappedExpression[];
  defaultExpressions: MappedExpression[];
  categories: Category[];
} {
  const [expressions, setExpressions] = useState<MappedExpression[]>([]);
  const [zipCodes, setZipCodes] = useState<MappedExpression[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const flatRegexps = useMemoizedFn(flatExpressions);

  const { zipCodesExpressions, defaultExpressions, regexpCategories } = flatRegexps(
    expressionsJSON as unknown as ExpressionItem[]
  );
  setExpressions(defaultExpressions as unknown as MappedExpression[]);
  setZipCodes(zipCodesExpressions as unknown as MappedExpression[]);
  setCategories(categories);

  return { zipCodesExpressions: zipCodes, defaultExpressions: expressions, categories: regexpCategories };
}
