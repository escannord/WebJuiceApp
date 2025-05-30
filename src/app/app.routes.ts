import { Routes } from "@angular/router";

import { MainComponent } from "./components/layouts/main/main.component";
import { AuthComponent } from "./components/layouts/auth/auth.component";
import { alreadyLoggedInGuard } from "./core/guards/already-logged-in.guard";
import { authGuard } from "./core/guards/auth.guard";

export const routes: Routes = [
  { path: "", redirectTo: "auth/login", pathMatch: "full" },
  {
    path: "dashboard",
    component: MainComponent,
    loadChildren: () =>
      import("./routes/dashbord.route").then((mod) => mod.DASHBORD_ROUTES),
    canActivate: [authGuard],
  },
  {
    path: "auth",
    component: AuthComponent,
    loadChildren: () =>
      import("./routes/auth.route").then((mod) => mod.AUTH_ROUTES),
    canActivate: [alreadyLoggedInGuard],
  },
  { path: "**", redirectTo: "dashboard/" },
];
