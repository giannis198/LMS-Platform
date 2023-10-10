"use client";

import { ColumnDef } from "@tanstack/react-table";

// import CourseCellAction from "../cells/CourseCellAction";
import { Course } from "@prisma/client";





export const columns: ColumnDef<Course>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "isPublished",
    header: "Published",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  // {
  //   id: "actions",
  //   cell: ({ row }) => <CourseCellAction data={row.original} />,
  // },
];
