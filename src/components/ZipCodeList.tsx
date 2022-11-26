import { List } from "@raycast/api"
import { MappedExpression } from "../types"
import ExpressionItemActions from "./actions/ExpressionItemActions"

export default function ZipCodesList({ expressions }: {
  expressions: MappedExpression[]
}) {
  return <List>
    {expressions.map(item => {
      return <List.Item
        key={item.id}
        title={item.name}
        subtitle={item.displayName}
        accessories={[{ text: `${item.displayName}` }]}
        actions={<ExpressionItemActions regexp={item.regexp} />}
      />
    })}
  </List>
}