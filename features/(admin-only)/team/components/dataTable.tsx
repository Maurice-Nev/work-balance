"use client";

import * as React from "react";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ColumnDef,
  ColumnFiltersState,
  Row,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  MoreVerticalIcon,
  GripVerticalIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  ColumnsIcon,
  ChevronDownIcon,
} from "lucide-react";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ChartContainer } from "@/components/ui/chart";
import DepartmentForm from "@/features/(admin-only)/department/forms/departmentForm";
import { useIsMobile } from "@/hooks/use-mobile";
import { User } from "@/supabase/types/database.models";
import { DepartmentModal } from "@/features/(admin-only)/department/components/departmentModal";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RegisterModal } from "./registerModal";
import RegisterForm from "../forms/registerForm";

// 🔹 User Schema für Type-Safety mit Zod
export const UserSchema = z.object({
  id: z.string(),
  name: z.string().nullable(), // ✅ Erlaubt NULL-Werte
  surname: z.string().nullable(),
  email: z.string().nullable(),
  role_id: z.string().nullable(),
  password: z.string().nullable(),
  created_at: z.string(),
  role: z
    .object({
      id: z.string(),
      name: z.string().nullable(),
      created_at: z.string(),
    })
    .nullable(), // ✅ Falls `role` null sein kann
});
// 🔹 Drag Handle Komponente
function DragHandle({ id }: { id: UniqueIdentifier }) {
  const { attributes, listeners } = useSortable({ id });
  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="size-7 text-muted-foreground hover:bg-transparent"
    >
      <GripVerticalIcon className="size-3 text-muted-foreground" />
    </Button>
  );
}

// 🔹 User Spalten-Definitionen
const columns: ColumnDef<z.infer<typeof UserSchema>>[] = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id} />,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <TableCellViewer item={row.original} />,
  },
  {
    accessorKey: "email",
    header: "E-Mail",
    cell: ({ row }) => row.original.email,
  },
  {
    accessorKey: "role.name",
    header: "Role",
    cell: ({ row }) => (
      <Badge variant="outline" className="px-2 py-1">
        {row?.original?.role?.name}
      </Badge>
    ),
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString(),
  },
  {
    id: "actions",
    header: "Actions",
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="size-8" size="icon">
            <MoreVerticalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

// 🔹 Sortierbare Zeilen
function DraggableRow({ row }: { row: Row<z.infer<typeof UserSchema>> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  });

  return (
    <TableRow
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={isDragging ? "opacity-50" : ""}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}

// 🔹 Hauptkomponente für die User DataTable
export function UserTable({
  data: initialData,
}: {
  data: z.infer<typeof UserSchema>[];
}) {
  const [data, setData] = React.useState(initialData);

  // Synchronisiere Daten, wenn sich initialData ändert (z. B. durch React Query)
  React.useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const sortableId = React.useId();
  const sensors = useSensors();
  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data.map(({ id }) => id),
    [data]
  );

  // Zustand für Pagination, Sortierung, etc.
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // React Table Setup
  const table = useReactTable({
    data,
    columns,
    state: { sorting, pagination },
    getRowId: (row) => row.id.toString(),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
  });

  // Drag & Drop Handler
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id);
        const newIndex = dataIds.indexOf(over.id);
        return arrayMove(data, oldIndex, newIndex);
      });
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-end px-4 lg:px-6">
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <ColumnsIcon />
                <span className="hidden lg:inline">Customize Columns</span>
                <span className="lg:hidden">Columns</span>
                <ChevronDownIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== "undefined" &&
                    column.getCanHide()
                )
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          {/* <Button variant="outline" size="sm">
                  <PlusIcon />
                  <span className="hidden lg:inline">Add Department</span>
                </Button> */}
          <RegisterModal />
        </div>
      </div>
      <div className="overflow-hidden rounded-lg border">
        <DndContext
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis]}
          onDragEnd={handleDragEnd}
          sensors={sensors}
          id={sortableId}
        >
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                <SortableContext
                  items={dataIds}
                  strategy={verticalListSortingStrategy}
                >
                  {table.getRowModel().rows.map((row) => (
                    <DraggableRow key={row.id} row={row} />
                  ))}
                </SortableContext>
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DndContext>
      </div>
      <div className="flex items-center justify-between px-4">
        <div className="hidden flex-1 text-sm text-muted-foreground lg:flex">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex w-full items-center gap-8 lg:w-fit">
          <div className="hidden items-center gap-2 lg:flex">
            <Label htmlFor="rows-per-page" className="text-sm font-medium">
              Rows per page
            </Label>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="w-20" id="rows-per-page">
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-fit items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to first page</span>
              <ChevronsLeftIcon />
            </Button>
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeftIcon />
            </Button>
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRightIcon />
            </Button>
            <Button
              variant="outline"
              className="hidden size-8 lg:flex"
              size="icon"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              <ChevronsRightIcon />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TableCellViewer({ item }: { item: z.infer<typeof UserSchema> }) {
  const isMobile = useIsMobile();

  // const chartData = prepareChartData(item);
  // const { ratingTrend, commentTrend } = analyzeTrends(item);

  // 🔹 Berechnung der "All Time" Werte
  // const allTimeTotalRatings = item.rating.length;
  // const allTimeAvgRating =
  //   allTimeTotalRatings > 0
  //     ? item.rating.reduce((sum, r) => sum + (r.rating ?? 0), 0) /
  //       allTimeTotalRatings
  //     : 0;
  // const allTimeCommentCount = item.rating.filter((r) => r.comment).length;

  // // 🔹 Berechnung der "Last 8 Weeks" Werte
  // const last8WeeksData = chartData.slice(-8); // Nur die letzten 8 Wochen nehmen
  // const last8WeeksTotal = last8WeeksData.length;
  // const last8WeeksAvgRating =
  //   last8WeeksTotal > 0
  //     ? last8WeeksData.reduce((sum, week) => sum + week.avgRating, 0) /
  //       last8WeeksTotal
  //     : 0;
  // const last8WeeksAvgComments =
  //   last8WeeksTotal > 0
  //     ? last8WeeksData.reduce((sum, week) => sum + week.commentCount, 0) /
  //       last8WeeksTotal
  //     : 0;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="link" className="w-fit px-0 text-left text-foreground">
          {item.name} {item.surname}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex flex-col">
        <SheetHeader className="gap-1">
          <SheetTitle>
            {item.name} {item.surname}
          </SheetTitle>
          {/* <SheetDescription>Aktivity (Last 8 weeks)</SheetDescription> */}
        </SheetHeader>
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto py-4 text-sm">
          <pre>{JSON.stringify(item, null, 2)}</pre>
          {/* {!isMobile && (
            <>
              <ChartContainer config={chartConfig}>
                <AreaChart data={chartData} margin={{ left: 0, right: 10 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <ChartTooltip
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <Area
                    dataKey="avgRating"
                    stroke="hsl(var(--cart-1))"
                    fillOpacity={0.3}
                    fill="hsl(var(--chart-1))"
                  />
                  <Area
                    dataKey="commentCount"
                    stroke="hsl(var(--chart-2))"
                    fillOpacity={0.3}
                    fill="hsl(var(--chart-2))"
                  />
                </AreaChart>
              </ChartContainer>
              <Separator />

              <div className="grid gap-2 p-4">
                <div
                  className={`flex gap-2 font-medium leading-none ${
                    ratingTrend > 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  Rating Trend: {ratingTrend > 0 ? "Up" : "Down"} by{" "}
                  {Math.abs(ratingTrend).toFixed(1)}
                  {ratingTrend > 0 ? (
                    <TrendingUpIcon className="size-4" />
                  ) : (
                    <TrendingDownIcon className="size-4" />
                  )}
                </div>
                <div
                  className={`flex gap-2 font-medium leading-none ${
                    commentTrend > 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  Comment Trend: {commentTrend > 0 ? "Up" : "Down"} by{" "}
                  {Math.abs(commentTrend)}
                  {commentTrend > 0 ? (
                    <TrendingUpIcon className="size-4" />
                  ) : (
                    <TrendingDownIcon className="size-4" />
                  )}
                </div>
                <div className="text-muted-foreground">
                  Weekly analysis of rating trends and comments.
                </div>
              </div>
              <Separator />

              <div className="grid gap-2 p-4">
                <div className="text-lg font-semibold">All Time Stats</div>
                <div className="flex gap-2 text-sm">
                  <span className="font-medium">Avg Rating:</span>{" "}
                  {allTimeAvgRating.toFixed(2)}
                </div>
                <div className="flex gap-2 text-sm">
                  <span className="font-medium">Total Comments:</span>{" "}
                  {allTimeCommentCount}
                </div>

                <div className="text-lg font-semibold mt-2">Last 8 Weeks</div>
                <div className="flex gap-2 text-sm">
                  <span className="font-medium">Avg Rating:</span>{" "}
                  {last8WeeksAvgRating.toFixed(2)}
                </div>
                <div className="flex gap-2 text-sm">
                  <span className="font-medium">Avg Comments per Week:</span>{" "}
                  {last8WeeksAvgComments.toFixed(2)}
                </div>
              </div>
              <Separator />
            </>
          )} */}
        </div>
        <SheetFooter>
          {/* <DepartmentForm initialValues={item} /> */}
          <RegisterForm initialValues={item} />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
