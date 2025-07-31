// === FILE: src/utils/sanitizeBigInt.ts ===

export const sanitizeBigInt = (data: any) => {
  if (!Array.isArray(data)) return data;

  return data.map((row) => {
    const sanitized: Record<string, any> = {};
    for (const key in row) {
      const value = row[key];
      sanitized[key] = typeof value === "bigint" ? Number(value) : value;
    }
    return sanitized;
  });
};
