/**
 * Q3 - autocomplete(search, items, maxResult)
 *
 * Return the items that contain `search` (case-insensitive), ranked by where
 * the match occurs: a match at the start of the word first, then matches
 * further and further into the word. Finally cut the list to `maxResult`.
 *
 * Idea: String.prototype.indexOf already gives the position of the match,
 * so the rank of an item is simply that index. Items whose match is at the
 * same position keep their original order in `items`, which is done with an
 * explicit tie-break on the original index rather than relying on the sort
 * being stable.
 *
 * Time  O(n * m + n log n) - scan every item, then sort the matches.
 * Space O(n)               - one entry per matching item.
 */

export function autocomplete(
  search: string,
  items: readonly string[],
  maxResult: number,
): string[] {
  // Nothing can be returned, so skip the work entirely.
  // A fractional limit is rounded down: 2.7 means "at most 2".
  const limit = Math.floor(maxResult);
  if (!Number.isFinite(limit) || limit <= 0) return [];

  const needle = search.toLowerCase();

  const matches = items
    .map((item, originalIndex) => ({
      item,
      originalIndex,
      matchIndex: item.toLowerCase().indexOf(needle),
    }))
    .filter((entry) => entry.matchIndex !== -1);

  matches.sort(
    (a, b) =>
      a.matchIndex - b.matchIndex || a.originalIndex - b.originalIndex,
  );

  return matches.slice(0, limit).map((entry) => entry.item);
}
