import { useMemo, useState } from "react";
import { Issue } from "../@types";

interface Config {
  key: string;
  direction: string;
}

export const useSortableData = (
  items: Issue[],
  config: Config | null = null
) => {
  const [sortConfig, setSortConfig] = useState(config);

  const sortedItems = useMemo(() => {
    let sortableItems = [...items];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if ((a as any)[sortConfig.key] < (b as any)[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if ((a as any)[sortConfig.key] > (b as any)[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [items, sortConfig]);

  const requestSort = (key: string) => {
    let direction = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  return { items: sortedItems, requestSort, sortConfig };
};
