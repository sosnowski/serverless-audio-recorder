import React, { lazy } from 'react';

const LazyComponent = lazy(() => import('./NotFound'));

export default () => <LazyComponent />;