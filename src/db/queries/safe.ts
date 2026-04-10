// DB操作のエラーハンドリングラッパー
// 読み取り系はnull/[]を返し、書き込み系はthrowする

export async function safeQuery<T>(
  fn: () => Promise<T>,
  fallback: T
): Promise<T> {
  try {
    return await fn();
  } catch (e) {
    console.error("[DB Query Error]", e);
    return fallback;
  }
}

export async function safeMutation<T>(
  fn: () => Promise<T>,
  errorMessage = "操作に失敗しました"
): Promise<{ data: T } | { error: string }> {
  try {
    const data = await fn();
    return { data };
  } catch (e: any) {
    console.error("[DB Mutation Error]", e);
    // UNIQUE制約違反
    if (e?.code === "23505") {
      return { error: "既に存在するデータです" };
    }
    return { error: errorMessage };
  }
}
