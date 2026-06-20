"use client";
import { Reservation, User } from "./types";
import { reservations as mockReservations } from "./data";

// Simple in-memory store (replace with real API/DB calls in production)

let _reservations: Reservation[] = [...mockReservations];
let _currentUser: User | null = null;

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("pch_user");
  return raw ? JSON.parse(raw) : null;
}

export function setCurrentUser(user: User | null) {
  if (user) localStorage.setItem("pch_user", JSON.stringify(user));
  else localStorage.removeItem("pch_user");
  _currentUser = user;
}

export function getReservations(): Reservation[] {
  return _reservations;
}

export function addReservation(r: Reservation) {
  _reservations = [r, ..._reservations];
}

export function updateReservation(id: string, updates: Partial<Reservation>) {
  _reservations = _reservations.map((r) => (r.id === id ? { ...r, ...updates } : r));
}
