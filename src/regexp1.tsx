import { List, Icon } from '@raycast/api';
import { nanoid } from 'nanoid';
import { useEffect, useState } from 'react';
import ExpressionItemActions from './components/actions/ExpressionItemActions';
import ZipCodeItemActions from './components/actions/ZipCodeItemActions';
import CategoriesDropdown from './components/CategoriesDropdown';
import useExpressionsStore from './hooks/useExpressionsStore';
import { iconsMap } from './icons';
import { MappedExpression } from './types';

export default function Command() {
  const { defaultExpressions, zipCodesExpressions, categories } = useExpressionsStore();
  const [search, setSearch] = useState<string>("");
  const [filteredExpressions, setFilteredExpressions] = useState<MappedExpression[]>(defaultExpressions);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    if (search.trim() === "") {
      setFilteredExpressions(defaultExpressions);
      return;
    }
    setFilteredExpressions(
      defaultExpressions.filter((expression: MappedExpression) => {
        return (
          expression.displayName.toLowerCase().includes(search.toLowerCase()) ||
          expression.name.toLowerCase().includes(search.toLowerCase())
        );
      })
    )
  }, [search, defaultExpressions]);

  useEffect(() => {
    console.log('selectedCategory', selectedCategory)
    const expressionsToDisplay = selectedCategory === 'all' ?
      defaultExpressions :
      defaultExpressions.filter(
        (expression: MappedExpression) => expression.category === selectedCategory
      );

    setFilteredExpressions(expressionsToDisplay);
  }, [selectedCategory, defaultExpressions]);

  function handleCategoryChange(category: string) {
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
          actions={<ExpressionItemActions regexp={item.regexp} link={item.link} />}
        />
      )}
      {
        (zipCodesExpressions.length && 'Zip Codes'.toLowerCase().includes(search.toLowerCase())) && <List.Item
          key={nanoid()}
          title={"Zip Codes"}
          icon={Icon.BarCode}
          accessories={[{ text: "Zip Codes" }]}
          actions={<ZipCodeItemActions expressions={zipCodesExpressions} />}
        />
      }
    </List>
  )
}