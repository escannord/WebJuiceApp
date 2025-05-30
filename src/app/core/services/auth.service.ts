import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { Router } from "@angular/router";
import { environment } from "../../../environments/environment.development";
import { StorageService } from "./storage.service";
import {
  AuthCredentials,
  ForgotPassword,
  ResetPasswordType,
} from "../../models/auth.model";

interface User {
  id: number;
  username: string;
  email: string;
  role: "admin" | "user";
}

interface LoginResponse {
  token: string;
  user: User;
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private readonly apiBaseUrl = environment.apiBaseUrl;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private storageService: StorageService
  ) {
    this.initializeAuthState();
  }

  private initializeAuthState() {
    const token = localStorage.getItem("token");
    if (token) {
      // Decode token (if needed) and set user
      const user = this.decodeToken(token); // Implement JWT decoding
      this.currentUserSubject.next(user);
    }
  }

  login(credentials: AuthCredentials): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiBaseUrl}/auth/login`, {
        email: credentials.email,
        password: credentials.password,
      })
      .pipe(
        tap((response) => {
          this.setAccessToken(response.token);
          this.currentUserSubject.next(response.user);
        })
      );
  }

  register(userData: {
    username: string;
    email: string;
    password: string;
  }): Observable<User> {
    return this.http.post<User>(`${this.apiBaseUrl}/auth/register`, userData);
  }

  logout() {
    this.clearTokens();
    this.currentUserSubject.next(null);
    this.router.navigate(["/auth/login"]);
  }

  refreshToken(): Observable<any> {
    const token = this.getRefreshToken();
    if (!token) {
      throw new Error("Refresh token not found");
    }

    // return this.refreshTokenUseCase.execute(token).pipe(
    //   tap(res => {
    //     this.setTokens(res?.data?.accessToken, res?.data?.refreshToken);
    //   })
    // );
    return new Observable<any>();
  }

  resetPassword(payload: ResetPasswordType): Observable<any> {
    return new Observable<any>();
  }

  requestPasswordReset(payload: ForgotPassword): Observable<any> {
    return new Observable<any>();
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }

  isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return user?.role === "admin";
  }

  private decodeToken(token: string): User {
    // Example: Use `jwt-decode` library for JWT parsing
    const payload = JSON.parse(atob(token.split(".")[1]));
    return {
      id: payload.sub,
      username: payload.username,
      email: payload.email,
      role: payload.role,
    };
  }

  getAccessToken(): string | null {
    return this.storageService.get("accessToken");
  }

  getRefreshToken(): string | null {
    return this.storageService.get("refreshToken");
  }

  setAccessToken(token: string): void {
    this.storageService.set("accessToken", token);
  }

  setRefreshToken(token: string): void {
    this.storageService.set("refreshToken", token);
  }


  clearTokens(): void {
    this.storageService.remove("accessToken");
    this.storageService.remove("refreshToken");
  }

  setRememberedEmail(email: string): void {
    if (typeof document === "undefined") return;
    const expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + 14); // 14 jours
    document.cookie = `rememberedEmail=${email}; expires=${expireDate.toUTCString()}; path=/; SameSite=Strict`;
  }

  getRememberedEmail(): string | null {
    if (typeof document === "undefined") return null;
    const cookies = document.cookie.split(";");
    const match = cookies.find((c) => c.trim().startsWith("rememberedEmail="));
    return match ? decodeURIComponent(match.split("=")[1]) : null;
  }

  clearRememberedEmail() {
    document.cookie =
      "rememberedEmail=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }

  setRememberedPassword(password: string): void {
    if (typeof document === "undefined") return;
    const expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + 14); // 14 days
    const encoded = btoa(password);
    document.cookie = `rememberedPassword=${encodeURIComponent(
      encoded
    )}; expires=${expireDate.toUTCString()}; path=/; SameSite=Strict`;
  }

  getRememberedPassword(): string | null {
    if (typeof document === "undefined") return null;
    const cookies = document.cookie.split(";");
    const match = cookies.find((c) =>
      c.trim().startsWith("rememberedPassword=")
    );
    return match ? atob(decodeURIComponent(match.split("=")[1])) : null;
  }

  clearRememberedPassword(): void {
    document.cookie =
      "rememberedPassword=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }
}
