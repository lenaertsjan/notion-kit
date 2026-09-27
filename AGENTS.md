# Agent Instructions

- Before editing code, read [.agents/guidelines/coding.md](.agents/guidelines/coding.md).

## Storybook MCP

When working on UI components, always use the `notion-kit-storybook` MCP tools to access Storybook's component and documentation knowledge before answering or taking any action. The docs server is `https://storybook.spica.dev/mcp`.

Development and testing tools only exist on the local Storybook dev server at `http://localhost:6006/mcp`. Start that with `pnpm --filter @notion-kit/storybook dev` when you need them.

- Never assume a component prop exists. Before using any property on a `@notion-kit` component, check it with the MCP tools.
- Call `docs-list` for the documented components and docs pages.
- Call `docs-show` with an id from that list to see props and examples.
- Call `docs-show-story` for a story variant that the component docs do not cover.
- Use only properties that are documented or shown in example stories. If a property is not documented, ask the user instead of guessing from naming conventions or other libraries.
- Call `get-storybook-story-instructions` on the local server before creating or updating stories.
- Check UI changes with `run-story-tests` on the local server.

A story name might not match the prop name. Verify properties through documentation or example stories before using them.
