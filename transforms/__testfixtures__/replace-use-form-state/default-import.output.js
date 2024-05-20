import ReactDOM from "react-dom";

function StatefulForm({}) {
  const [state, formAction] = ReactDOM.useActionState(increment, 0);
  return <form></form>;
}
