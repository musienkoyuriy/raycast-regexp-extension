import { ActionPanel, Action } from "@raycast/api";

export default function ExpressionItemActions({ regexp, link }: { regexp: string, link?: string }) {
  return <ActionPanel>
    <ActionPanel.Section>
      <Action.CopyToClipboard content={regexp} title="Copy regexp.." />
    </ActionPanel.Section>
    {link && <ActionPanel.Section>
      <Action.OpenInBrowser url={link} title="Show example in browser" />
    </ActionPanel.Section>}
  </ActionPanel>
}