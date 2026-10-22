import { useState } from "react";
import { Plus, Minus } from "lucide-react";

export interface AccordionItem {
  id: string;
  question: string;
  answer: string;
}

export function Accordion({ items }: { items: AccordionItem[] }) {
  const [open, setOpen] = useState<string | null>(items[0]?.id ?? null);

  return (
    <div className="accordion">
      {items.map((item) => {
        const expanded = open === item.id;
        return (
          <div key={item.id} className={`accordion__item${expanded ? " is-open" : ""}`}>
            <h3>
              <button
                type="button"
                aria-expanded={expanded}
                aria-controls={`faq-${item.id}`}
                onClick={() => setOpen(expanded ? null : item.id)}
              >
                <span>{item.question}</span>
                <span className="accordion__icon" aria-hidden="true">
                  {expanded ? <Minus size={16} /> : <Plus size={16} />}
                </span>
              </button>
            </h3>
            <div id={`faq-${item.id}`} className="accordion__panel" hidden={!expanded}>
              <p>{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
