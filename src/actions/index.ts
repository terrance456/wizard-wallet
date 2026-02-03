"use server";

import { revalidateTag } from "next/cache";

export async function revalidateNextTags(tag: string) {
  revalidateTag(tag, {});
}
