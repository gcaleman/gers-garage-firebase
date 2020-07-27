import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "../services/auth.service";
import { take, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: "root",
})
export class AdminGuard implements CanActivate {
  constructor(public authService: AuthService, public router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {

    return this.authService.user$.pipe(
      take(1),
      map(user => user && user.roles.admin ? true: false),
      tap(isAdmin => {
        if (!isAdmin) {
          console.error("Access Denied.")
        }
      })
    );
  }
}
