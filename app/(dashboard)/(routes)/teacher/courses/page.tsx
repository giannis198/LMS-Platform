

import { Button } from "@/components/ui/button";
import { db } from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";

import Link from "next/link";
import { redirect } from "next/navigation";

import { DataTable } from "@/components/DataTable";
import { columns } from "@/components/columns/Columns";

const CoursesPage = async () => {
  const { userId } = auth()

  if (!userId) return redirect('/')

  const courses = await db.course.findMany({
    where: {
     userId
    },
    include: {
      category: true,
      chapters: true,
    },
    orderBy: {
      createdAt: "desc"
    }
  })


  return (
    <div className="p-6">
      <DataTable columns={columns} data={courses} />
    </div>
  );
};

export default CoursesPage;
