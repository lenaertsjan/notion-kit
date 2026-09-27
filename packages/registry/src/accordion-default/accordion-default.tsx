import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@notion-kit/ui/primitives";

export default function Demo() {
  return (
    <Accordion defaultValue={["item-1"]} className="w-80">
      <AccordionItem value="item-1">
        <AccordionTrigger>What is Notion Kit?</AccordionTrigger>
        <AccordionContent>
          A collection of Notion-styled UI primitives and blocks for React.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Is it themeable?</AccordionTrigger>
        <AccordionContent>
          Yes, every primitive follows the shared design tokens and supports
          dark mode out of the box.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Can multiple sections stay open?</AccordionTrigger>
        <AccordionContent>
          Pass the multiple prop to the accordion root to allow more than one
          item to be expanded at a time.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
