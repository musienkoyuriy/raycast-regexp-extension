import { List, ActionPanel, Action, clearSearchBar } from "@raycast/api";
import { useEffect, useState, useCallback, useMemo } from "react";
import expressionsJSON from "../assets/expressions.json";
import CategoriesDropdown from "./components/CategoriesDropdown";
import ZipCodesList from "./components/ZipCodeList";
import { iconsMap } from "./icons";
import { MappedExpression } from "./types";
import { flatExpressions } from "./utilities";

export function ExpressionItemActions({ regexp, link }: { regexp: string; link?: string }): JSX.Element {
  return (
    <ActionPanel>
      <ActionPanel.Section>
        <Action.CopyToClipboard content={regexp} title="Copy regexp.." />
      </ActionPanel.Section>
      {link && (
        <ActionPanel.Section>
          <Action.OpenInBrowser url={link} title="Show example in browser" />
        </ActionPanel.Section>
      )}
    </ActionPanel>
  );
}

function ZipCodeItemActions({ expressions }: { expressions: MappedExpression[] }): JSX.Element {
  const memoizedExpressions = useMemo(() => expressions, [expressions]);
  return (
    <ActionPanel>
      <Action.Push title="Show zip codes" target={<ZipCodesList expressions={memoizedExpressions} />} />
    </ActionPanel>
  );
}

export default function Command() {
  const { defaultExpressions, zipCodesExpressions, regexpCategories } = useMemo(
    () => flatExpressions(expressionsJSON),
    [expressionsJSON]
  );

  const [search, setSearch] = useState<string>("");
  const [filteredExpressions, setFilteredExpressions] = useState<MappedExpression[]>(defaultExpressions);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    setFilteredExpressions(
      defaultExpressions.filter((expression: MappedExpression) => {
        return (
          (expression.displayName.toLowerCase().includes(search.toLowerCase()) ||
            expression.name.toLowerCase().includes(search.toLowerCase())) &&
          (selectedCategory === "all" || selectedCategory === expression.category)
        );
      })
    );
  }, [search, defaultExpressions, selectedCategory]);

  const handleCategoryChange = useCallback(
    (category: string) => {
      if (category === selectedCategory) {
        return;
      }
      setSelectedCategory(category);
      setSearch("");
    },
    [selectedCategory]
  );

  useEffect(() => {
    if (search.trim() != "") {
      return;
    }
    (async () => {
      await clearSearchBar({ forceScrollToTop: true });
    })();
  }, [search]);

  return (
    <List
      filtering={false}
      searchBarPlaceholder={"Search regular expression..."}
      onSearchTextChange={setSearch}
      searchBarAccessory={
        <CategoriesDropdown
          categories={regexpCategories}
          onCategoryChange={(newCategory: string) => handleCategoryChange(newCategory)}
        />
      }
    >
      {filteredExpressions.map((item) => (
        <List.Item
          key={item.id}
          title={item.name}
          icon={iconsMap.get(item.category)}
          subtitle={item.displayName}
          accessories={[{ text: item.displayName }]}
          actions={
            item.category !== "zipcode" ? (
              <ExpressionItemActions regexp={item.regexp!} link={item.link} />
            ) : (
              <ZipCodeItemActions expressions={zipCodesExpressions} />
            )
          }
        />
      ))}
    </List>
  );
}
