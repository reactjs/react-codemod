import * as ReactDOM from "react-dom";

function StatefulForm({}) {
  const [state, formAction] = ReactDOM.useFormState(increment, 0);
  return <form></form>;
}
