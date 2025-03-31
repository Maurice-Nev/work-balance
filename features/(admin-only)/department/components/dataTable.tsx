"use client";

import * as React from "react";
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
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
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  CheckCircle2Icon,
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  ColumnsIcon,
  GripVerticalIcon,
  LoaderIcon,
  MoreVerticalIcon,
  PlusIcon,
  TrendingDownIcon,
  TrendingUpIcon,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import { z } from "zod";

import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DepartmentModal } from "./departmentModal";
import { DialogTrigger } from "@/components/ui/dialog";
import DepartmentForm from "../forms/departmentForm";

export const Schema = z.object({
  id: z.number(),
  header: z.string(),
  type: z.string(),
  status: z.string(),
  target: z.string(),
  limit: z.string(),
  reviewer: z.string(),
});

export const DepartmentSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  created_at: z.string(),
  rating: z.array(
    z.object({
      id: z.string(),
      rating: z.number().nullable(),
      comment: z.string().nullable(),
      created_at: z.string(),
    })
  ),
});
// Create a separate component for the drag handle
function DragHandle({ id }: { id: number }) {
  const { attributes, listeners } = useSortable({
    id,
  });

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="size-7 text-muted-foreground hover:bg-transparent"
    >
      <GripVerticalIcon className="size-3 text-muted-foreground" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  );
}

const columns: ColumnDef<z.infer<typeof DepartmentSchema>>[] = [
  // {
  //   id: "drag",
  //   header: () => null,
  //   cell: ({ row }) => <DragHandle id={row.original.id} />,
  // },
  // {
  //   id: "drag",
  //   header: () => null,
  //   cell: ({ row, table }) => {
  //     const index = table.getRowModel().rows.findIndex((r) => r.id === row.id); // Index des Rows
  //     return <DragHandle id={index} />;
  //   },
  // },
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <div className="flex items-center justify-center">
  //       <Checkbox
  //         checked={
  //           table.getIsAllPageRowsSelected() ||
  //           (table.getIsSomePageRowsSelected() && "indeterminate")
  //         }
  //         onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //         aria-label="Select all"
  //       />
  //     </div>
  //   ),
  //   cell: ({ row }) => (
  //     <div className="flex items-center justify-center">
  //       <Checkbox
  //         checked={row.getIsSelected()}
  //         onCheckedChange={(value) => row.toggleSelected(!!value)}
  //         aria-label="Select row"
  //       />
  //     </div>
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: "name",
    header: "Department",
    cell: ({ row }) => {
      return <TableCellViewer item={row.original} />;
    },
    enableHiding: false,
  },
  {
    accessorKey: "average_rating",
    header: "Avg. Rating",
    cell: ({ row }) => {
      const ratings = row.original.rating;
      if (!ratings || ratings.length === 0) return <span>No ratings</span>;

      // Durchschnitt berechnen
      const avgRating = (
        ratings.reduce((sum, r) => sum + (r.rating ?? 0), 0) / ratings.length
      ).toFixed(1);

      return (
        <Badge variant="outline" className="px-2 py-1">
          {avgRating} / 5
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const ratings = row.original.rating;

      if (!ratings || ratings.length === 0) {
        return (
          <Badge
            variant="outline"
            className="flex gap-1 px-1.5 text-muted-foreground"
          >
            <LoaderIcon />
            No Ratings
          </Badge>
        );
      }

      // Durchschnittliche Bewertung berechnen
      const avgRating =
        ratings.reduce((sum, r) => sum + (r.rating ?? 0), 0) / ratings.length;

      // Farben nach Rating setzen
      let color = "text-green-500 dark:text-green-400"; // Standard: Grün
      let label = "Good";

      if (avgRating < 2) {
        color = "text-red-500 dark:text-red-400";
        label = "Bad";
      } else if (avgRating >= 2 && avgRating < 4) {
        color = "text-yellow-500 dark:text-yellow-400";
        label = "Warning";
      }

      return (
        <Badge
          variant="outline"
          className={`flex gap-1 px-1.5 text-muted-foreground [&_svg]:size-3 ${color}`}
        >
          <CheckCircle2Icon className={color} />
          {label}
        </Badge>
      );
    },
  },

  {
    accessorKey: "total_reviews",
    header: "Total Reviews",
    cell: ({ row }) => (
      <span>{row.original.rating ? row.original.rating.length : 0}</span>
    ),
  },
  {
    id: "actions",
    cell: () => (
      <div className="w-full flex justify-end">
        {" "}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex size-8 text-muted-foreground data-[state=open]:bg-muted"
              size="icon"
            >
              <MoreVerticalIcon />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            {/* <DepartmentModal>
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
              }}
            >
              <DialogTrigger asChild>
                <span className="w-full">Edit</span>
              </DialogTrigger>
            </DropdownMenuItem>
          </DepartmentModal> */}
            <DropdownMenuItem>Make a copy</DropdownMenuItem>
            <DropdownMenuItem>Favorite</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
];

function DraggableRow({ row }: { row: Row<z.infer<typeof DepartmentSchema>> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  });

  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}

export function DataTable({
  data: initialData,
}: {
  data: z.infer<typeof DepartmentSchema>[];
}) {
  const [data, setData] = React.useState(initialData);

  // Synchronisiere Daten, wenn sich initialData ändert (z. B. durch React Query)
  React.useEffect(() => {
    setData(initialData);
  }, [initialData]);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const sortableId = React.useId();
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map(({ id }) => id) || [],
    [data]
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

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
    <div className="flex w-full flex-col justify-start gap-6">
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
          <DepartmentModal />
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
            <TableHeader className="sticky top-0 z-10 bg-muted">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="**:data-[slot=table-cell]:first:w-8">
              {table.getRowModel().rows?.length ? (
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
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
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

export const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

type Department = z.infer<typeof DepartmentSchema>;
import { parseISO, startOfWeek, format } from "date-fns";

export function analyzeTrends(item: Department) {
  if (!item.rating || item.rating.length === 0)
    return { ratingTrend: 0, commentTrend: 0 };

  // Aggregiere Daten pro Woche
  const weeklyData = new Map<
    string,
    { totalRating: number; count: number; comments: number }
  >();

  item.rating.forEach(({ rating, comment, created_at }) => {
    if (rating === null) return; // Falls keine Bewertung existiert, ignorieren

    const weekStart = format(startOfWeek(parseISO(created_at)), "yyyy-MM-dd");

    if (!weeklyData.has(weekStart)) {
      weeklyData.set(weekStart, { totalRating: 0, count: 0, comments: 0 });
    }

    const weekData = weeklyData.get(weekStart)!;
    weekData.totalRating += rating;
    weekData.count += 1;
    weekData.comments += comment ? 1 : 0;
  });

  // Array für Trendberechnung
  const trendArray = Array.from(weeklyData.entries()).map(([week, data]) => ({
    week,
    avgRating: data.totalRating / data.count,
    commentCount: data.comments,
  }));

  if (trendArray.length < 2) return { ratingTrend: 0, commentTrend: 0 };

  // Trend-Berechnung (Differenz zwischen erster und letzter Woche)
  const ratingTrend =
    trendArray[trendArray.length - 1].avgRating - trendArray[0].avgRating;
  const commentTrend =
    trendArray[trendArray.length - 1].commentCount - trendArray[0].commentCount;

  return { ratingTrend, commentTrend };
}

export function prepareChartData(item: Department) {
  if (!item.rating || item.rating.length === 0) return [];

  const weeklyData = new Map<
    string,
    { totalRating: number; count: number; commentCount: number }
  >();

  item.rating.forEach(({ rating, comment, created_at }) => {
    if (rating === null) return; // Falls Bewertung fehlt, ignorieren

    const weekStart = format(startOfWeek(parseISO(created_at)), "yyyy-MM-dd");

    if (!weeklyData.has(weekStart)) {
      weeklyData.set(weekStart, { totalRating: 0, count: 0, commentCount: 0 });
    }

    const weekData = weeklyData.get(weekStart)!;
    weekData.totalRating += rating;
    weekData.count += 1;
    weekData.commentCount += comment ? 1 : 0; // Falls Kommentar vorhanden ist, zählen
  });

  return Array.from(weeklyData.entries())
    .map(([week, data]) => ({
      week,
      avgRating: data.totalRating / data.count,
      commentCount: data.commentCount,
    }))
    .sort((a, b) => new Date(a.week).getTime() - new Date(b.week).getTime()); // Sortierung von alt nach neu
}

function TableCellViewer({ item }: { item: Department }) {
  const isMobile = useIsMobile();

  const chartData = prepareChartData(item);
  const { ratingTrend, commentTrend } = analyzeTrends(item);

  // 🔹 Berechnung der "All Time" Werte
  const allTimeTotalRatings = item.rating.length;
  const allTimeAvgRating =
    allTimeTotalRatings > 0
      ? item.rating.reduce((sum, r) => sum + (r.rating ?? 0), 0) /
        allTimeTotalRatings
      : 0;
  const allTimeCommentCount = item.rating.filter((r) => r.comment).length;

  // 🔹 Berechnung der "Last 8 Weeks" Werte
  const last8WeeksData = chartData.slice(-8); // Nur die letzten 8 Wochen nehmen
  const last8WeeksTotal = last8WeeksData.length;
  const last8WeeksAvgRating =
    last8WeeksTotal > 0
      ? last8WeeksData.reduce((sum, week) => sum + week.avgRating, 0) /
        last8WeeksTotal
      : 0;
  const last8WeeksAvgComments =
    last8WeeksTotal > 0
      ? last8WeeksData.reduce((sum, week) => sum + week.commentCount, 0) /
        last8WeeksTotal
      : 0;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="link" className="w-fit px-0 text-left text-foreground">
          {item.name}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex flex-col">
        <SheetHeader className="gap-1">
          <SheetTitle>{item.name}</SheetTitle>
          <SheetDescription>
            Ratings & Comments Trend (Last 8 weeks)
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto py-4 text-sm">
          {!isMobile && (
            <>
              {/* <ChartContainer config={chartConfig}>
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
              </ChartContainer> */}
              <ChartContainer config={chartConfig}>
                <BarChart accessibilityLayer data={chartData}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="week"
                    // tickLine={false}
                    // tickMargin={10}
                    // axisLine={false}
                    // tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dashed" />}
                  />
                  <Bar
                    dataKey="avgRating"
                    label="desktop"
                    fill="var(--color-desktop)"
                    radius={4}
                  />
                  <Bar
                    dataKey="commentCount"
                    fill="var(--color-mobile)"
                    radius={4}
                  />
                </BarChart>
              </ChartContainer>
              <Separator />

              {/* 🔹 Trendanalyse Sektion */}
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

              {/* 🔹 Neue Sektion: All Time & Last 8 Weeks Stats */}
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
          )}
        </div>
        <SheetFooter>
          <DepartmentForm initialValues={item} />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
