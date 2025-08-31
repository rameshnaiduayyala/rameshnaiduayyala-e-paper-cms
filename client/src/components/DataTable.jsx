
// Reusability:
//   <DataTable
//      columns={columns}
//      data={data}
//      pageSizeOptions={[5, 10, 20, 50]}
//      initialSorting={[{ id: "name", desc: false }]}
//      enableRowSelection
//   />
// -------------------------------------------------------------

import React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

// ---------- Utility UI bits (pure Tailwind) ----------
function SearchBox({ value, onChange, placeholder = "Search..." }) {
  return (
    <div className="relative w-full sm:w-72">
      <input
        className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-2 pr-9 text-sm shadow-sm outline-none transition focus:border-gray-400"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">⌘K</span>
    </div>
  );
}

function Pill({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-700">
      {children}
    </span>
  );
}

function Button({ children, className = "", ...props }) {
  return (
    <button
      className={`rounded-2xl border border-gray-300 px-3 py-1.5 text-sm shadow-sm transition hover:bg-gray-50 active:scale-[.99] ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

function IconButton({ children, className = "", ...props }) {
  return (
    <button
      className={`grid h-9 w-9 place-items-center rounded-xl border border-gray-300 text-sm shadow-sm transition hover:bg-gray-50 active:scale-[.99] ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

function EmptyState({ title = "No results", subtitle = "Try adjusting your filters." }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 py-12 text-center">
      <div className="text-3xl">🔎</div>
      <p className="text-sm font-medium text-gray-800">{title}</p>
      <p className="text-xs text-gray-500">{subtitle}</p>
    </div>
  );
}

// ---------- The Reusable DataTable Component ----------
export function DataTable({
  columns,
  data,
  pageSizeOptions = [10, 20, 50],
  initialSorting = [],
  enableRowSelection = false,
  globalFilterPlaceholder = "Search...",
}) {
  const [sorting, setSorting] = React.useState(initialSorting);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});

  // Optionally inject a selection column when enabled
  const computedColumns = React.useMemo(() => {
    if (!enableRowSelection) return columns;
    return [
      {
        id: "_select",
        header: ({ table }) => (
          <input
            type="checkbox"
            className="h-4 w-4 accent-black"
            checked={table.getIsAllPageRowsSelected()}
            onChange={table.getToggleAllPageRowsSelectedHandler()}
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            className="h-4 w-4 accent-black"
            checked={row.getIsSelected()}
            disabled={!row.getCanSelect()}
            onChange={row.getToggleSelectedHandler()}
          />
        ),
        size: 48,
        enableSorting: false,
        enableHiding: false,
      },
      ...columns,
    ];
  }, [columns, enableRowSelection]);

  const table = useReactTable({
    data,
    columns: computedColumns,
    state: { sorting, globalFilter, columnVisibility, rowSelection },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableRowSelection,
    initialState: {
      pagination: { pageSize: pageSizeOptions?.[0] ?? 10 },
    },
  });

  const selectedCount = table.getSelectedRowModel().rows.length;

  return (
    <div className="grid gap-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <SearchBox
            value={globalFilter}
            onChange={setGlobalFilter}
            placeholder={globalFilterPlaceholder}
          />

          <details className="group">
            <summary className="list-none">
              <Button>
                Columns
                <span className="ml-2 text-[10px] text-gray-500 group-open:hidden">▾</span>
                <span className="ml-2 text-[10px] text-gray-500 hidden group-open:inline">▴</span>
              </Button>
            </summary>
            <div className="mt-2 grid w-56 gap-1 rounded-2xl border border-gray-200 bg-white p-2 shadow-lg">
              {table.getAllLeafColumns().map((col) => {
                if (col.id === "_select") return null;
                return (
                  <label key={col.id} className="flex items-center justify-between gap-3 rounded-xl px-2 py-1.5 text-sm hover:bg-gray-50">
                    <span className="truncate text-gray-700">{col.columnDef.header?.toString?.() ?? col.id}</span>
                    <input
                      type="checkbox"
                      className="h-4 w-4 accent-black"
                      checked={col.getIsVisible()}
                      onChange={col.getToggleVisibilityHandler()}
                    />
                  </label>
                );
              })}
            </div>
          </details>

          <div className="flex items-center gap-2">
            <Pill>{table.getFilteredRowModel().rows.length} rows</Pill>
            {enableRowSelection && selectedCount > 0 && (
              <Pill>{selectedCount} selected</Pill>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-500">Rows / page</label>
          <select
            className="rounded-xl border border-gray-300 bg-white p-2 text-sm shadow-sm"
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
          >
            {pageSizeOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-600">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    style={{ width: header.getSize?.() }}
                    className="select-none whitespace-nowrap px-3 py-2 font-semibold"
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={
                          header.column.getCanSort()
                            ? "flex cursor-pointer items-center gap-1"
                            : ""
                        }
                        onClick={header.column.getToggleSortingHandler()}
                        title={
                          header.column.getCanSort()
                            ? header.column.getNextSortingOrder() === "asc"
                              ? "Sort ascending"
                              : header.column.getNextSortingOrder() === "desc"
                              ? "Sort descending"
                              : "Clear sort"
                            : undefined
                        }
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getIsSorted() === "asc" && <span>▲</span>}
                        {header.column.getIsSorted() === "desc" && <span>▼</span>}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={table.getAllLeafColumns().length}>
                  <EmptyState />
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  data-selected={row.getIsSelected()}
                  className="border-t border-gray-100 data-[selected=true]:bg-gray-50 hover:bg-gray-50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="whitespace-nowrap px-3 py-2 align-middle text-gray-800">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs text-gray-500">
          Page <span className="font-semibold">{table.getState().pagination.pageIndex + 1}</span> of {table.getPageCount() || 1}
        </div>
        <div className="flex items-center gap-2">
          <IconButton onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()} title="First page">⏮</IconButton>
          <IconButton onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} title="Previous page">◀</IconButton>
          <IconButton onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} title="Next page">▶</IconButton>
          <IconButton onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()} title="Last page">⏭</IconButton>
      
          <div className="ml-2 flex items-center gap-2">
            <label className="text-xs text-gray-500">Go to</label>
            <input
              type="number"
              min={1}
              className="w-16 rounded-xl border border-gray-300 bg-white px-2 py-1 text-sm shadow-sm"
              defaultValue={table.getState().pagination.pageIndex + 1}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const page = Number(e.currentTarget.value) - 1;
                  if (!Number.isNaN(page)) table.setPageIndex(Math.max(0, Math.min(page, table.getPageCount() - 1)));
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}