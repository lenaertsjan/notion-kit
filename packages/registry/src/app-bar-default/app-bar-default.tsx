import { Icon } from "@notion-kit/icons";
import { AppBar } from "@notion-kit/ui/navbar/presets";
import { Button } from "@notion-kit/ui/primitives";

export default function AppBarDefault() {
  return (
    <AppBar
      brand="Bliv"
      breadcrumbs={[{ label: "Fleet", href: "#" }, { label: "Machines" }]}
      actions={
        <Button variant="icon" aria-label="Refresh">
          <Icon.Undo />
        </Button>
      }
      user={{ name: "Ada Lovelace", email: "ada@example.com" }}
      onSignOut={() => {
        /* no-op for story */
      }}
    />
  );
}
