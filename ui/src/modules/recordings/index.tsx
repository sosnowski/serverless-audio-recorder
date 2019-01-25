import React, { lazy } from 'react';

const LazyComponent = lazy(() => import('./Recordings'));

export default () => <LazyComponent />;
