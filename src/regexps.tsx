import { List, ActionPanel, Action } from '@raycast/api';
import { useEffect, useState } from 'react';
import CategoriesDropdown from './components/CategoriesDropdown';
import ZipCodesList from './components/ZipCodeList';
import useExpressionsStore from './hooks/useExpressionsStore';
import { iconsMap } from './icons';
import { MappedExpression } from './types';

export function ExpressionItemActions({ regexp, link }: { regexp: string, link?: string }): JSX.Element {
  return <ActionPanel>
    <ActionPanel.Section>
      <Action.CopyToClipboard content={regexp} title="Copy regexp.." />
    </ActionPanel.Section>
    {link && <ActionPanel.Section>
      <Action.OpenInBrowser url={link} title="Show example in browser" />
    </ActionPanel.Section>}
  </ActionPanel>
}

function ZipCodeItemActions({ expressions }: {
  expressions: MappedExpression[]
}): JSX.Element {
  return <ActionPanel>
    <Action.Push
      title="Show zip codes"
      target={<ZipCodesList expressions={expressions} />} />
  </ActionPanel>
}

export default function Command() {
  const { defaultExpressions, zipCodesExpressions, categories } = useExpressionsStore();
  const [search, setSearch] = useState<string>("");
  const [filteredExpressions, setFilteredExpressions] = useState<MappedExpression[]>(defaultExpressions);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    setFilteredExpressions(
      defaultExpressions.filter((expression: MappedExpression) => {
        return (
          (
            expression.displayName.toLowerCase().includes(search.toLowerCase()) ||
            expression.name.toLowerCase().includes(search.toLowerCase())
          ) &&
          (selectedCategory === 'all' || selectedCategory === expression.category)
        );
      })
    )
  }, [search, defaultExpressions, selectedCategory]);

  function handleCategoryChange(category: string): void {
    if (category === selectedCategory) {
      return;
    }
    setSelectedCategory(category);
  }

  return (
    <List
      filtering={false}
      onSearchTextChange={setSearch}
      searchBarAccessory={
        <CategoriesDropdown
          categories={categories}
          onCategoryChange={
            (newCategory: string) => handleCategoryChange(newCategory)
          } />
      }>
      {filteredExpressions.map(item =>
        <List.Item
          key={item.id}
          title={item.name}
          icon={iconsMap.get(item.category)}
          subtitle={item.displayName}
          accessories={[{ text: item.displayName }]}
          actions={
            item.category !== 'zipcode' ?
              <ExpressionItemActions regexp={item.regexp!} link={item.link} /> :
              <ZipCodeItemActions expressions={zipCodesExpressions} />
          }
        />
      )}
    </List>
  )
}