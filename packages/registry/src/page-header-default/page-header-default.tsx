import { PageHeader } from "@notion-kit/ui/page-header";
import { Button } from "@notion-kit/ui/primitives";

export default function PageHeaderDefault() {
  return (
    <PageHeader
      eyebrow="Fleet"
      title="Machines"
      subtitle="All machines provisioned across regions"
      actions={<Button>Add machine</Button>}
    />
  );
}
