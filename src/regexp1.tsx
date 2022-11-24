import { List, ActionPanel, Action } from '@raycast/api'
import { nanoid } from 'nanoid'
import { useEffect, useState } from 'react'
import useExpressionsStore from './hooks/useExpressionsStore'
import { MappedExpression } from './types'

function ExpressionItemActions({ regexp }: { regexp: string }) {
  return <ActionPanel>
    <ActionPanel.Section>
      <Action.CopyToClipboard content={regexp} title="Copy regexp.." />
    </ActionPanel.Section>
    <ActionPanel.Section>
      <Action.OpenInBrowser url='https//www.youtube.com' title="Show example in browser" />
    </ActionPanel.Section>
  </ActionPanel>
}


const ZipCodesList = ({ expressions }: { expressions: MappedExpression[] }) => {
  return <List>
    {expressions.map(item => {
      return <List.Item
        key={item.id}
        title={item.name}
        subtitle={item.category}
        accessories={[{ text: `${item.category}` }]}
        actions={<ExpressionItemActions regexp={item.regexp} />}
      />
    })}
  </List>
}

function ZipCodeItemActions({ expressions }: { expressions: MappedExpression[] }) {
  return <ActionPanel>
    <Action.Push
      title="Show zip codes"
      target={<ZipCodesList expressions={expressions} />} />
  </ActionPanel>
}

export default function Command() {
  const { defaultExpressions, zipCodesExpressions } = useExpressionsStore()
  const [search, setSearch] = useState<string>("")
  const [filteredExpressions, setFilteredExpressions] = useState<MappedExpression[]>(defaultExpressions)

  useEffect(() => {
    if (search.trim() === "") {
      setFilteredExpressions(defaultExpressions);
      return;
    }
    setFilteredExpressions(
      defaultExpressions.filter((expression: MappedExpression) => {
        return (
          expression.category.toLowerCase().includes(search.toLowerCase()) ||
          expression.name.toLowerCase().includes(search.toLowerCase())
        )
      })
    )
  }, [search, defaultExpressions])

  return (
    <List
      filtering={false}
      onSearchTextChange={setSearch}>
      {filteredExpressions?.map(item => (
        <List.Item
          key={item.id}
          title={item.name}
          subtitle={item.category}
          accessories={[{ text: `${item.category}` }]}
          actions={<ExpressionItemActions regexp={item.regexp} />}
        />
      ))}
      {
        zipCodesExpressions.length && <List.Item
          title={"Zip Codes"}
          accessories={[{ text: "Zip Codes" }]}
          actions={<ZipCodeItemActions expressions={zipCodesExpressions} />}
        />
      }
    </List>
  )
}