import { db } from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.courseId) {
      return new NextResponse("CourseID is required", { status: 400 });
    }

    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    });

    if (!course) {
      return new NextResponse("Not found", { status: 404 });
    }

    const courseToUnpublish = await db.course.updateMany({
      where: {
        id: params.courseId,
        userId,
      },
      data: {
        isPublished: false,
      },
    });

    return NextResponse.json(courseToUnpublish);
  } catch (error) {
    console.log("[COURSE_UNPUBLISH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
