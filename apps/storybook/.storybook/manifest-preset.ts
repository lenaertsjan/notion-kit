import { readFileSync } from "node:fs";
import { join } from "node:path";

type ManifestComponent = {
  import?: string;
  path?: string;
};

type Manifests = {
  components?: {
    components?: Record<string, ManifestComponent>;
  };
};

type Binding = {
  name: string;
  kind: "default" | "named";
  specifier: string;
};

// Storybook's resolver does not understand package export wildcards, so it
// rewrites `@notion-kit/ui/primitives` to `@notion-kit/ui` and can merge
// unrelated names into that import. Restore each name's specifier from the story.
function storyBindings(storySource: string) {
  const bindings = new Map<string, Binding>();
  const pattern = /import\s+(?:type\s+)?([\s\S]*?)\s+from\s+["']([^"']+)["']/g;

  for (const match of storySource.matchAll(pattern)) {
    const clause = match[1]?.trim();
    const specifier = match[2];
    if (!clause || !specifier) continue;

    const named = clause.match(/\{([^}]+)\}/)?.[1];
    if (named) {
      for (const part of named.split(",")) {
        const name = part
          .trim()
          .split(/\s+as\s+/)
          .pop()
          ?.trim();
        if (name) bindings.set(name, { name, kind: "named", specifier });
      }
    }

    const defaultName = clause
      .replace(/\{[^}]*\}/, "")
      .replace(",", "")
      .trim();
    if (defaultName)
      bindings.set(defaultName, {
        name: defaultName,
        kind: "default",
        specifier,
      });
  }

  return bindings;
}

function generatedNames(line: string) {
  const match = line
    .trim()
    .match(/^import\s+(?:type\s+)?([\s\S]*?)\s+from\s+["']([^"']+)["'];?$/);
  if (!match?.[1] || !match[2]) return [];

  const names: Array<{ name: string; specifier: string }> = [];
  const named = match[1].match(/\{([^}]+)\}/)?.[1];
  if (named) {
    for (const part of named.split(",")) {
      const name = part
        .trim()
        .split(/\s+as\s+/)
        .pop()
        ?.trim();
      if (name) names.push({ name, specifier: match[2] });
    }
  }

  const defaultName = match[1]
    .replace(/\{[^}]*\}/, "")
    .replace(",", "")
    .trim();
  if (defaultName) names.unshift({ name: defaultName, specifier: match[2] });
  return names;
}

export function restoreImports(generated: string, storySource: string) {
  const bindings = storyBindings(storySource);
  const groups = new Map<string, Binding[]>();

  for (const line of generated.split("\n")) {
    for (const imported of generatedNames(line)) {
      const binding = bindings.get(imported.name) ?? {
        name: imported.name,
        kind: "named" as const,
        specifier: imported.specifier,
      };
      const key = `${binding.kind}:${binding.specifier}`;
      const group = groups.get(key) ?? [];
      if (!group.some((item) => item.name === binding.name))
        group.push(binding);
      groups.set(key, group);
    }
  }

  return [...groups.values()]
    .map((group) => {
      const specifier = group[0]?.specifier;
      if (!specifier) return "";
      const defaults = group
        .filter((item) => item.kind === "default")
        .map((item) => item.name);
      const named = group
        .filter((item) => item.kind === "named")
        .map((item) => item.name);
      const clause = [
        defaults.join(", "),
        named.length > 0 ? `{ ${named.join(", ")} }` : "",
      ]
        .filter(Boolean)
        .join(", ");
      return `import ${clause} from "${specifier}";`;
    })
    .filter(Boolean)
    .join("\n");
}

export async function experimental_manifests(manifests: Manifests = {}) {
  const components = manifests.components?.components;
  if (!components) return manifests;

  for (const component of Object.values(components)) {
    if (!component.import || !component.path) continue;

    let storySource: string;
    try {
      storySource = readFileSync(join(process.cwd(), component.path), "utf8");
    } catch {
      continue;
    }

    const restored = restoreImports(component.import, storySource);
    if (restored) component.import = restored;
  }

  return manifests;
}
