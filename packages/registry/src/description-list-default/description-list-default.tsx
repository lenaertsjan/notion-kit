import { DescriptionList } from "@notion-kit/ui/description-list";

export default function Demo() {
  return (
    <DescriptionList
      className="w-96"
      columns={2}
      items={[
        { key: "owner", term: "Owner", value: "Ada Lovelace" },
        { key: "status", term: "Status", value: "Active" },
        { key: "created", term: "Created", value: "Jan 4, 2024" },
        { key: "workspace", term: "Workspace", value: "Engineering" },
      ]}
    />
  );
}
