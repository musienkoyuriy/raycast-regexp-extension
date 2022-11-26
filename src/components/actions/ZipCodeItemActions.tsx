import { Action, ActionPanel } from "@raycast/api";
import { MappedExpression } from "../../types";
import ZipCodesList from "../ZipCodeList";

export default function ZipCodeItemActions({ expressions }: {
  expressions: MappedExpression[]
}) {
  return <ActionPanel>
    <Action.Push
      title="Show zip codes"
      target={<ZipCodesList expressions={expressions} />} />
  </ActionPanel>
}