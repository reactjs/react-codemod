import { useActionState as UFS, createPortal } from "react-dom";

function StatefulForm({}) {
  const [state, formAction] = UFS(increment, 0);

  createPortal();
  return <form></form>;
}
