import React, { lazy } from 'react';

const LazyComponent = lazy(() => import('./NewRecord'));

export default () => <LazyComponent />;