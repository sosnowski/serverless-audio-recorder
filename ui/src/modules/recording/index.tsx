import React, { lazy } from 'react';

const LazyComponent = lazy(() => import('./Recording'));

export default (props: any) => <LazyComponent {...props}/>;
