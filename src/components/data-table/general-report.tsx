"use client";

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { useState, useEffect, useRef, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "~/components/ui/dropdown-menu";
import { exportToPDF } from "~/lib/utils";
import CsvDownloader from "react-csv-downloader";
import { Button } from "../ui/button";
import { DownloadIcon } from "lucide-react";
// import { Checkbox } from "~/components/ui/checkbox";
// import {
//   Popover,
//   PopoverTrigger,
//   PopoverContent,
// } from "~/components/ui/popover";
// import { PopoverPortal } from "@radix-ui/react-popover";

// Define the structure of the sales report item

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  onRowClick: (rowData: TData) => void;
}

export function TransactionsDataTable<TData extends GeneralSalesReportItem>({
  columns,
  data,
  onRowClick,
}: DataTableProps<TData>) {
  const [rowSelection, setRowSelection] = useState({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [focusedRowIndex, setFocusedRowIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedParentItem, setSelectedParentItem] = useState<string>("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedParentItems, setSelectedParentItems] = useState<string[]>([]);
  const tableRef = useRef<HTMLDivElement>(null);

  const filteredData = useMemo(() => {
    return data.filter((item) =>
      selectedCategory ? item.user_id === selectedCategory : true,
    );
  }, [data, selectedCategory]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      rowSelection: rowSelection,
      sorting,
    },
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    enableRowSelection: true,
    enableMultiRowSelection: true,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handleKeyDown = (
    event: React.KeyboardEvent,
    rowIndex: number,
    rowData: TData,
  ) => {
    if (event.key === "Tab") {
      setFocusedRowIndex((prevIndex) =>
        prevIndex === null
          ? 0
          : Math.min(prevIndex + 1, table.getRowModel().rows.length - 1),
      );
    } else if (event.key === "Enter") {
      onRowClick(rowData);
    }
  };

  useEffect(() => {
    if (focusedRowIndex !== null && tableRef.current) {
      const rows = tableRef.current.querySelectorAll("tr");
      if (rows[focusedRowIndex]) {
        (rows[focusedRowIndex] as HTMLElement).focus();
      }
    }
  }, [focusedRowIndex]);

  const totalSum = filteredData.reduce((sum, item) => {
    return sum + parseFloat(item.unit_price) * parseInt(item.quantity);
  }, 0);
  const totalQuantity = filteredData.reduce((sum, item) => {
    return sum + parseInt(item.quantity);
  }, 0);

  const csvColumns = columns.map((column) => ({
    id: column.id!,
    displayName: column.header as string,
  }));

  const transformDataForCSV = (data: GeneralSalesReportItem[]) => {
    return data.map((item) => ({
      receipt_no: item.receipt_no,
      trans_time: item.trans_time,
      description: item.description,
      location_name: item.location_name,
      user_id: item.user_id,
      unit_price: item.unit_price,
      quantity: item.quantity,
    }));
  };

  const transformedData = transformDataForCSV(filteredData);

  return (
    <>
      <div className="flex items-center space-x-4 py-4">
        {/* <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">Open popover</Button>
          </PopoverTrigger>
          <PopoverContent>
            {Array.from(new Set(data.map((item) => item.category_name))).map(
              (category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox id={category} />
                  <label
                    htmlFor={category}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {category}
                  </label>
                </div>
                // <SelectItem key={category} value={category}>
                //   {category}
                // </SelectItem>
              ),
            )}
          </PopoverContent>
        </Popover> */}
        <Select onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select User" />
          </SelectTrigger>
          <SelectContent>
            {Array.from(new Set(data.map((item) => item.user_id))).map(
              (category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ),
            )}
          </SelectContent>
        </Select>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant={"outline"} size={"sm"}>
              <DownloadIcon className="mr-2 size-4" aria-hidden="true" />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onSelect={() =>
                exportToPDF(
                  filteredData,
                  columns as ColumnDef<GeneralSalesReportItem>[],
                )
              }
            >
              Export to PDF
            </DropdownMenuItem>
            <DropdownMenuItem>
              <CsvDownloader
                filename="table"
                columns={csvColumns}
                datas={transformedData}
              >
                Export to CSV
              </CsvDownloader>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border" ref={tableRef}>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {filteredData.length ? (
              table.getRowModel().rows.map((row, rowIndex) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  tabIndex={0}
                  onClick={() => onRowClick(row.original)}
                  onKeyDown={(event) =>
                    handleKeyDown(event, rowIndex, row.original)
                  }
                  onFocus={() => setFocusedRowIndex(rowIndex)}
                  className={focusedRowIndex === rowIndex ? "bg-gray-100" : ""}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-center">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={columns.length - 2} className="text-right">
                Total:
              </TableCell>
              <TableCell className="text-right">
                {totalQuantity.toFixed(2)}
              </TableCell>

              <TableCell className="text-right">
                {totalSum.toFixed(2)}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </>
  );
}

export default TransactionsDataTable;
