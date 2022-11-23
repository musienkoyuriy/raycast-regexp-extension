import { useState, useEffect } from "react";
import expressionsJSON from "../../assets/expressions.json";
import useMemoizedFn from "./useMemoizedFn";
import { nanoid } from "nanoid";
import { ExpressionItem, MappedExpression } from "../types";

export function processExpressionVariations(expressionItem: ExpressionItem): MappedExpression[] {
  return expressionItem.variations.map(({ name, regexp }) => ({
    name,
    regexp,
    category: expressionItem.displayName,
    id: nanoid(5),
  }));
}

export default function useExpressionsStore(): {
  zipCodesExpressions: MappedExpression[];
  defaultExpressions: MappedExpression[];
} {
  const [expressions, setExpressions] = useState<MappedExpression[]>([]);
  const [zipCodes, setZipCodes] = useState<MappedExpression[]>([]);

  const flatExpressions = useMemoizedFn(
    (
      expressions: ExpressionItem[]
    ): { zipCodesExpressions: MappedExpression[]; defaultExpressions: MappedExpression[] } => {
      const mappedExpressions: MappedExpression[] = [];
      const mappedZipcodes: MappedExpression[] = [];

      for (const expression of expressions) {
        if (expression.category !== "zipcode") {
          mappedExpressions.push(...processExpressionVariations(expression));
        } else {
          mappedZipcodes.push(...processExpressionVariations(expression));
        }
      }
      return {
        defaultExpressions: mappedExpressions,
        zipCodesExpressions: mappedZipcodes,
      };
    }
  );

  useEffect(() => {
    const { zipCodesExpressions, defaultExpressions } = flatExpressions(expressionsJSON as unknown as ExpressionItem[]);
    setExpressions(defaultExpressions as unknown as MappedExpression[]);
    setZipCodes(zipCodesExpressions as unknown as MappedExpression[]);
  }, []);

  return { zipCodesExpressions: zipCodes, defaultExpressions: expressions };
}
