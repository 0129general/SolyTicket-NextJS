import { useEffect, useState } from "react";

export function usePagination(currentPage: number, lastPage: number): string[] {
  const DELTA: number = 2;
  const [result, setResult] = useState<string[]>([]);

  useEffect(() => {
    const LEFT: number = currentPage - DELTA;
    const RIGHT: number = currentPage + DELTA + 1;
    const range: number[] = [];
    const rangeWithDots: string[] = [];
    let l: number = 0;

    for (let i = 1; i <= lastPage; i++) {
      if (i == 1 || i == lastPage || (i >= LEFT && i < RIGHT)) {
        range.push(i);
      }
    }

    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push((l + 1)?.toString());
        } else if (i - l !== 1) {
          rangeWithDots.push("...");
        }
      }

      rangeWithDots.push(i?.toString());
      l = i;
    }

    setResult(rangeWithDots);
  }, [currentPage, lastPage, DELTA]);

  return result;
}
