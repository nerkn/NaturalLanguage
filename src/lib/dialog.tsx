import { ReactNode, useEffect, useRef, useState } from "react";

export function useDialog() {
  const [opened, openedSet] = useState(false);
  useEffect(() => {
    if (opened) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [opened]);
  const dialogRef = useRef<HTMLDialogElement>(null);
  let open = () => openedSet(true);
  let close = () => openedSet(false);

  function DialogElem({ children }: { children: ReactNode }) {
    return <dialog ref={dialogRef}>{children}</dialog>;
  }

  return { open, close, DialogElem };
}
