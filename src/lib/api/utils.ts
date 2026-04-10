import { NextResponse } from "next/server";
import { type ZodType, type ZodIssue } from "zod";

export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ data }, { status });
}

export function created<T>(data: T) {
  return NextResponse.json({ data }, { status: 201 });
}

export function err(message: string, status = 400, code?: string) {
  return NextResponse.json({ error: { message, code } }, { status });
}

export function validationErr(issues: ZodIssue[]) {
  return NextResponse.json(
    {
      error: {
        message: "バリデーションエラー",
        code: "VALIDATION_ERROR",
        details: issues,
      },
    },
    { status: 422 }
  );
}

// リクエストボディをZodスキーマでバリデーション
export async function parseBody<T>(
  request: Request,
  schema: ZodType<T>
): Promise<{ data: T } | { error: NextResponse }> {
  try {
    const body = await request.json();
    const result = schema.safeParse(body);
    if (!result.success) {
      return { error: validationErr(result.error.issues as ZodIssue[]) };
    }
    return { data: result.data };
  } catch {
    return { error: err("リクエストボディの解析に失敗しました", 400) };
  }
}
