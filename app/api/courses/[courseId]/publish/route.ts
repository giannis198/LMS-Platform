import { db } from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
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
      include: {
        chapters: {
          include: {
            muxData: true,
          },
        },
      },
    });

    if (!course) {
      return new NextResponse("Not found", { status: 400 });
    }

    if (!course) return redirect("/");

    const hasPublishedchapters = course.chapters.some(
      (chapter) => chapter.isPublished
    );

    if (
      !course ||
      !course.title ||
      !course.description ||
      !course.imageUrl ||
      !course.price ||
      !course.categoryId ||
      !hasPublishedchapters
    ) {
      return new NextResponse("Missing Required Fields", { status: 401 });
    }

    const courseToPublish = await db.course.updateMany({
      where: {
        id: params.courseId,
        userId,
      },
      data: {
        isPublished: true,
      },
    });

    return NextResponse.json(courseToPublish);
  } catch (error) {
    console.log("[COURSE_PUBLISH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
