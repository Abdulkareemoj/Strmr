import { Suspense } from "react";
import SearchClient from "./search-client";

export default function Search() {
  return (
    <Suspense fallback={<div className="py-12 text-center text-muted-foreground">Loading...</div>}>
      <SearchClient />
    </Suspense>
  );
}
