import React, { useEffect, useState } from "react";
import { format, isValid, parseISO } from "date-fns";
// Utility function for date/time formatting, used for "created_at" and "execution_date"
function formatDateTime(value) {
  const date = new Date(value);
  if (!isValid(date)) return "-";
  return (
    <div className="text-center">
      <div>{format(date, "dd.MM.yyyy")}</div>
      <span
        className="time"
        style={{
          color: "#555",
          fontSize: "0.75em",
          display: "block",
          textAlign: "center",
        }}
      >
        {format(date, "HH:mm")}
      </span>
    </div>
  );
}
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  getSortedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
} from "@tanstack/react-table";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";

export default function ProceduresList({ procedures }) {
  // Sort procedures by created_at descending before using in table
  const sortedProcedures = React.useMemo(() => {
    if (!procedures) return [];
    // Defensive: ensure valid ISO date strings
    return [...procedures].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [procedures]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filtering and column visibility state
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnVisibility, setColumnVisibility] = React.useState({});

  const API_URL = import.meta.env.VITE_API_URL;

  // Column header translations
  const translatedHeaders = {
    evaluation_result: "תוצאה",
    notes: "הערות",
    xray_url: "צילום רנטגן",
    created_at: "נוצר בתאריך",
    approval_status: "סטטוס אישור",
    patient_name: "שם המטופל",
    procedure_type: "סוג פרוצדורה",
    doctor: "רופא",
    procedure_name: "שם פרוצדורה",
    procedure_code: "קוד פרוצדורה",
    patient_id: "תעודת זהות מטופל",
    doctor_name: "שם רופא",
    execution_date: "תאריך ביצוע",
    // Add more translations as needed
  };

  // Define columns as ColumnDef[]
  const columns = React.useMemo(() => {
    const sample = sortedProcedures[0] || {};
    return Object.keys(sample)
      .filter((k) => k !== "id_")
      .map((key) => {
        if (key === "created_at") {
          return {
            accessorKey: key,
            header: ({ column }) => {
              // Show arrow if sorted by this column
              const isSorted = column.getIsSorted();
              let arrow = "";
              if (isSorted === "asc") arrow = (
                <span style={{ opacity: 0.5, fontWeight: 400, fontSize: "1em" }}>↑</span>
              );
              else if (isSorted === "desc") arrow = (
                <span style={{ opacity: 0.5, fontWeight: 400, fontSize: "1em" }}>↓</span>
              );
              return (
                <Button
                  variant="ghost"
                  onClick={() => column.toggleSorting(isSorted === "asc")}
                >
                  <span className="font-bold text-sm text-gray-700">
                    {translatedHeaders[key] || key} {arrow}
                  </span>
                </Button>
              );
            },
            cell: ({ row }) => formatDateTime(row.getValue("created_at")),
            enableSorting: true,
            sortingFn: "datetime",
            sortDescFirst: true,
            defaultSort: "desc",
          };
        }
        if (key === "execution_date") {
          return {
            accessorKey: key,
            header: ({ column }) => {
              const isSorted = column.getIsSorted();
              let arrow = "";
              if (isSorted === "asc") arrow = "↑";
              else if (isSorted === "desc") arrow = "↓";
              return (
                <Button
                  variant="ghost"
                  onClick={() => column.toggleSorting(isSorted === "asc")}
                >
                  <span className="font-bold text-sm text-gray-700">
                    {translatedHeaders[key] || key} {arrow && <span style={{ opacity: 0.5, fontWeight: 400, fontSize: "1em" }}>{arrow}</span>}
                  </span>
                </Button>
              );
            },
            cell: ({ row }) => {
              const value = row.getValue("execution_date");
              const parsedDate = parseISO(value || "");
              if (!isValid(parsedDate)) {
                return <div className="text-center">תאריך לא תקף</div>;
              }
              return (
                <div className="text-center">
                  <div>{format(parsedDate, "dd.MM.yyyy")}</div>
                  <span
                    className="time"
                    style={{
                      color: "#555",
                      fontSize: "0.75em",
                      display: "block",
                      textAlign: "center",
                    }}
                  >
                    {format(parsedDate, "HH:mm")}
                  </span>
                </div>
              );
            },
            enableSorting: true,
          };
        }
        // --- שינוי כותרת עמודת תוצאה (approval_status) עם חץ כיוון סידור ---
        if (key === "approval_status") {
          return {
            accessorKey: key,
            header: ({ column }) => {
              const isSorted = column.getIsSorted();
              let arrow = "";
              if (isSorted === "asc") arrow = "↑";
              else if (isSorted === "desc") arrow = "↓";
              return (
                <Button
                  variant="ghost"
                  onClick={() => column.toggleSorting(isSorted === "asc")}
                >
                  <span className="font-bold text-sm text-gray-700">
                    {translatedHeaders[key] || key} {arrow && <span style={{ opacity: 0.5, fontWeight: 400, fontSize: "1em" }}>{arrow}</span>}
                  </span>
                </Button>
              );
            },
            cell: ({ getValue }) => {
              const val = getValue();
              return String(val);
            },
            enableSorting: true,
          };
        }
        if (key === "evaluation_result") {
          return {
            accessorKey: key,
            header: ({ column }) => {
              const isSorted = column.getIsSorted();
              let arrow = "";
              if (isSorted === "asc") arrow = "↑";
              else if (isSorted === "desc") arrow = "↓";
              return (
                <Button
                  variant="ghost"
                  onClick={() => column.toggleSorting(isSorted === "asc")}
                >
                  <span className="font-bold text-sm text-gray-700">
                    {translatedHeaders[key] || key} {arrow && <span style={{ opacity: 0.5, fontWeight: 400, fontSize: "1em" }}>{arrow}</span>}
                  </span>
                </Button>
              );
            },
            cell: ({ getValue, row }) => {
              const val = getValue();
              return (
                <Button
                  variant="outline"
                  className={
                    val?.approval_status === "דרוש בדיקה נוספת"
                      ? "bg-[rgb(217,119,6)] text-white"
                      : val?.approval_status === "מאושר"
                      ? "bg-[rgb(22,163,74)] text-white"
                      : val?.approval_status === "נדחה"
                      ? "bg-[rgb(220,38,38)] text-white"
                      : ""
                  }
                  onClick={() => {
                    const element = document.getElementById(`result-${row.index}`);
                    if (element) element.classList.toggle("hidden");
                  }}
                >
                  תוצאה
                </Button>
              );
            },
            sortingFn: (rowA, rowB) => {
              const statusOrder = {
                "מאושר": 0,
                "דרוש בדיקה נוספת": 1,
                "נדחה": 2,
              };
              const a = rowA.original.evaluation_result?.approval_status || "";
              const b = rowB.original.evaluation_result?.approval_status || "";
              return (statusOrder[a] ?? 99) - (statusOrder[b] ?? 99);
            },
            enableSorting: true,
          };
        }
        return {
          accessorKey: key,
          header: translatedHeaders[key] || key,
          cell: ({ getValue, row }) => {
            const val = getValue();
            if (key === "evaluation_result") {
              return (
                <Button
                  variant="outline"
                  className={
                    val?.approval_status === "דרוש בדיקה נוספת"
                      ? "bg-[rgb(217,119,6)] text-white"
                      : val?.approval_status === "מאושר"
                      ? "bg-[rgb(22,163,74)] text-white"
                      : val?.approval_status === "נדחה"
                      ? "bg-[rgb(220,38,38)] text-white"
                      : ""
                  }
                  onClick={() => {
                    const element = document.getElementById(`result-${row.index}`);
                    if (element) element.classList.toggle("hidden");
                  }}
                >
                  תוצאה
                </Button>
              );
            }
            if (key === "notes") {
              // Use a local component to manage expanded state per cell
              const NotesCell = ({ value }) => {
                const [expanded, setExpanded] = React.useState(false);
                return (
                  <div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setExpanded(!expanded)}
                    >
                      {expanded ? "הסתר" : "הצג"}
                    </Button>
                    {expanded && <div className="mt-2 whitespace-pre-wrap">{String(value)}</div>}
                  </div>
                );
              };
              return <NotesCell value={val} />;
            }
            if (key === "xray_url") {
              return (
                <Button
                  variant="outline"
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = `${API_URL}/download_image/${val}`;
                    link.download = val;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                >
                  הורד תמונה
                </Button>
              );
            }
            if (typeof val === "boolean") return val ? "כן" : "לא";
            if (typeof val === "object" && val !== null) return JSON.stringify(val, null, 2);
            return String(val);
          },
        };
      });
  }, [procedures]);

  // Only initialize the table when procedures prop is received
  useEffect(() => {
    if (procedures && Array.isArray(procedures)) {
      setLoading(false);
      setError(null);
    } else {
      setLoading(false);
      setError("שגיאה בטעינת הנתונים");
    }
  }, [procedures]);

  const table = useReactTable({
    data: sortedProcedures,
    columns,
    state: {
      globalFilter,
      columnVisibility,
    },
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    // Initial sort by created_at descending
    initialState: {
      sorting: [{ id: "created_at", desc: true }],
    },
  });

  if (loading) {
    return <div>טוען פרוצדורות...</div>;
  }
  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }
  if (!procedures.length) {
    return (
      <div className="p-12 text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-file-text w-12 h-12 text-slate-400 mx-auto mb-4"
        >
          <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
          <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
          <path d="M10 9H8"></path>
          <path d="M16 13H8"></path>
          <path d="M16 17H8"></path>
        </svg>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          לא נמצאו פרוצדורות
        </h3>
        <p className="text-slate-600">נסה לשנות את קריטריוני החיפוש</p>
      </div>
    );
  }

  return (
    <div className="px-6">
      <h2 className="text-xl font-bold mb-4 text-right">רשימת פרוצדורות</h2>
      <div className="flex items-center py-4 gap-2">
        <Input
          placeholder="חפש..."
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto bg-white">
              עמודות
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white">
            {table.getAllLeafColumns().map((column) => (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={() => column.toggleVisibility()}
              >
                {translatedHeaders[column.id] || column.id}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border bg-white shadow-sm">
        <Table className="w-full border border-gray-200 rounded-md shadow-sm">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-gray-100">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-center font-bold text-sm text-gray-700 bg-gray-100">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <React.Fragment key={row.id}>
                  <TableRow
                    data-state={row.getIsSelected() && "selected"}
                    className={`${row.index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={`text-sm text-gray-900 ${cell.column.id === "execution_date" ? "text-center" : "text-center"}`}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow key={`result-${row.id}`} id={`result-${row.index}`} className="hidden">
                    <TableCell colSpan={columns.length}>
                      <div className="p-4 border rounded bg-white shadow-md">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              {Object.keys(row.original.evaluation_result?.ai_analysis || {}).map((subKey) => {
                                const translations = {
                                  risk_level: "רמת סיכון",
                                  confidence: "רמת ודאות",
                                  findings: "ממצאים",
                                  recommendations: "המלצות",
                                  medical_justification: "הצדקה רפואית",
                                  contraindications: "ללא התוויות נגד",
                                };
                                return (
                                  <TableHead key={subKey} className="text-center font-bold text-sm text-gray-700 bg-gray-100">
                                    {translations[subKey] || subKey}
                                  </TableHead>
                                );
                              })}
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              {Object.values(row.original.evaluation_result?.ai_analysis || {}).map((val, idx) => (
                                <TableCell key={idx} className="text-center text-sm text-gray-900">
                                  {typeof val === "boolean" ? (val ? "כן" : "לא") : String(val)}
                                </TableCell>
                              ))}
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-sm text-gray-900">
                  לא נמצאו תוצאות
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          הקודם
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          הבא
        </Button>
      </div>
    </div>
  );
}