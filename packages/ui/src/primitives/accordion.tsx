import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";

import { cn } from "@notion-kit/cn";
import { Icon } from "@notion-kit/icons";

import { typography } from "./variants";

function Accordion<Value = string>({
  ...props
}: AccordionPrimitive.Root.Props<Value>) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />;
}

function AccordionItem({ className, ...props }: AccordionPrimitive.Item.Props) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("border-b border-border last:border-b-0", className)}
      {...props}
    />
  );
}

function AccordionTrigger({
  className,
  children,
  ...props
}: AccordionPrimitive.Trigger.Props) {
  return (
    <AccordionPrimitive.Header data-slot="accordion-header" className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          typography("h3"),
          "group flex flex-1 items-center justify-between gap-2 py-4 text-left text-primary transition-shadow outline-none",
          "hover:underline",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-hidden",
          "disabled:pointer-events-none disabled:opacity-50 data-disabled:pointer-events-none data-disabled:opacity-50",
          className,
        )}
        {...props}
      >
        {children}
        <Icon.Chevron
          side="right"
          className="size-4 shrink-0 text-muted transition-transform duration-200 group-data-panel-open:rotate-90"
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}: AccordionPrimitive.Panel.Props) {
  return (
    <AccordionPrimitive.Panel
      data-slot="accordion-content"
      className={cn(
        "h-(--accordion-panel-height) overflow-hidden text-sm text-primary transition-[height] duration-200 ease-out",
        "data-ending-style:h-0 data-starting-style:h-0",
        className,
      )}
      {...props}
    >
      <div className="pt-0 pb-4">{children}</div>
    </AccordionPrimitive.Panel>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
