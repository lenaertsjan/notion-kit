# Claude

Follow [AGENTS.md](AGENTS.md).

## Storybook MCP

When working on UI components, always use the `notion-kit-storybook` MCP tools before answering or taking any action. The docs server is `https://storybook.spica.dev/mcp`.

- Never assume a component prop exists. Check it with the MCP tools first.
- Call `docs-list`, then `docs-show` with an id from that list. Use `docs-show-story` for a specific story variant.
- Use only properties that are documented or shown in example stories. If a property is not documented, ask instead of guessing.
- Story instructions and story tests stay on the local dev server at `http://localhost:6006/mcp` (`pnpm --filter @notion-kit/storybook dev`).
