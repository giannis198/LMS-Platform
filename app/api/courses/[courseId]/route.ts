import { db } from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    const values = await req.json();

    

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!values) {
      return new NextResponse("Values are required", { status: 400 });
    }

    if (!params.courseId) {
      return new NextResponse("CourseID is required", { status: 400 });
    }

    const course = await db.course.updateMany({
      where: {
        id: params.courseId,
        userId,
      },
      data: {
        ...values
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.log("[COURSE_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
