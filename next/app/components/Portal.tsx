"use client";

import { useState } from "react";
import { createPortal } from "react-dom";

export default function Portal({ children }: { children: React.ReactNode }) {
  const [container] = useState(() => 
    typeof window !== "undefined" ? document.body : null
  );

  if (!container) return null;

  return createPortal(children, container);
}
