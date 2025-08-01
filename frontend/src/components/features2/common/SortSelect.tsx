type Props = {
  sortOrder: "asc" | "desc";
  setSortOrder: (order: "asc" | "desc") => void;
};

export default function SortSelect({ sortOrder, setSortOrder }: Props) {
  return (
    <select
      className="border p-2 rounded"
      value={sortOrder}
      onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
    >
      <option value="asc">Sort A-Z</option>
      <option value="desc">Sort Z-A</option>
    </select>
  );
}
