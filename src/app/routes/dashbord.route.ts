import { Route } from '@angular/router';

export const DASHBORD_ROUTES: Route[] = [
  {
    path: 'overview',
    loadComponent: () =>
      import('../pages/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
    title: 'Dashboard',
  },
  {
    path: 'history',
    loadComponent: () =>
      import('../pages/history/history.component').then(
        (m) => m.HistoryComponent
      ),
    title: 'History',
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('../pages/settings/settings.component').then(
        (m) => m.SettingsComponent
      ),
    title: 'Settings',
  },
  { path: '', redirectTo: '/dashboard/overview', pathMatch: 'full' },
];
