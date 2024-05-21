import { FunctionComponent } from 'react';

const App: FunctionComponent<{ message: string }> = ({ message }) => (
  <div>{message}</div>
);
