import { forwardRef } from 'react';

const MyTab = forwardRef(function Tab(
  props: TabProps | LinkTabProps,
  ref: React.ForwardedRef<HTMLButtonElement | HTMLAnchorElement>
) {
  return null;
});
