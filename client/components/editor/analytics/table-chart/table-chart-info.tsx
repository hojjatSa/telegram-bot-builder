/**
 * @fileoverview Раскрывающаяся подсказка «Что это за график?» для карточки графика по таблице
 * @module editor/analytics/table-chart/table-chart-info
 */

import React, { useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';

/**
 * Спойлер с пояснением о назначении графика по таблице:
 * на основе чего он строится, как работают оси, агрегации и типы графика.
 * @returns JSX элемент спойлера
 */
export function TableChartInfo(): React.JSX.Element {
  /** Открыт ли спойлер с пояснением */
  const [open, setOpen] = useState(false);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger
        className="flex items-center gap-1 text-[11px] text-muted-foreground/80 hover:text-muted-foreground transition-colors"
        data-testid="table-chart-info-trigger"
      >
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
        What kind of graph is this?
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-1.5">
        <div className="text-[11px] leading-relaxed text-muted-foreground/80 space-y-1.5">
          <p>
            The schedule is based on your <b>user tables</b> project -
            those that you create in the “Tables” tab. You choose which ones
            data and how to show it.
          </p>
          <ul className="list-disc pl-4 space-y-1">
            <li>
              <b>Category (X)</b> — a column by whose values ​​rows are grouped.
            </li>
            <li>
              <b>Value (Y)</b> — a column from which numbers are aggregated within the group.
            </li>
            <li>
              <b>Aggregations:</b> “Count” (number of rows in the group), “Sum”, “Average”,
              “Minimum”, “Maximum” - for a numerical column. For a non-numeric column
              Only "Quantity" is available.
            </li>
            <li>
              <b>Chart types:</b> “Columns”, “Line”, “Circle”.
            </li>
          </ul>
          <p className="text-muted-foreground/60">
            The top 50 categories are shown and the data is updated automatically.
          </p>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
