# Magazyn App - Authentication Setup Guide

## 🎯 Overview

To aplikacja Next.js z pełnym systemem autentykacji opartym na:
- **NextAuth.js** - System zarządzania sesją
- **Neon.tech PostgreSQL** - Baza danych
- **bcrypt** - Haszowanie haseł
- **JWT tokens** - Sesje o czasie trwania 7 dni

## 📋 Wymagane zmienne środowiskowe

### 1. Pobierz CONNECTION STRING z Neon.tech

1. Przejdź do https://neon.tech
2. Zaloguj się lub utwórz konto
3. Utwórz projekt
4. Skopiuj CONNECTION STRING do PostgreSQL (wygląda tak):
   ```
   postgresql://user:password@ep-xxxxx.neon.tech/dbname?sslmode=require
   ```

### 2. Wygeneruj NEXTAUTH_SECRET

W terminalu (PowerShell):
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Konfiguracja `.env.local`

Otwórz `web/.env.local` i zaktualizuj:
```env
# Neon Database Configuration
DATABASE_URL="postgresql://user:password@ep-xxxxx.neon.tech/dbname?sslmode=require"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-generated-secret-here"

# Admin credentials for testing (optional)
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="admin123"
```

## 🗄️ Konfiguracja bazy danych

### 1. Wykonaj migrację SQL

W Neon.tech query editor:
1. Otwórz SQL Editor
2. Skopiuj zawartość z `web/database.sql`
3. Wykonaj wszystkie zapytania

Lub z CLI (jeśli masz zainstalowany psql):
```powershell
psql "postgresql://user:password@ep-xxxxx.neon.tech/dbname?sslmode=require" -f web/database.sql
```

## 🚀 Uruchomienie aplikacji

### 1. Zainstaluj zależności
```powershell
cd web
npm install
```

### 2. Uruchom dev server
```powershell
npm run dev
```

### 3. Otwórz aplikację
```
http://localhost:3000
```

## 📱 Workflow użytkownika

### Rejestracja
1. Kliknij "Register" na stronie głównej
2. Wprowadź imię, email i hasło
3. System automatycznie zaloguje cię po rejestracji
4. Przekierowanie do panelu admina

### Logowanie
1. Kliknij "Sign In"
2. Wprowadź email i hasło
3. Po poprawnym logowaniu - panel admina

### Panel Admina
- Wyświetla informacje sesji
- Wyświetla czas trwania sesji (7 dni)
- Przycisk logout

### Logout
- Wylogowanie usuwa sesję
- Redirect na stronę główną
- Kliknięcie na login/register z logowaniem - redirect do dashboarda

## 🔒 Bezpieczeństwo

### Implementacje:
- ✅ Hasła haszowane bcrypt (10 salt rounds)
- ✅ JWT tokens z czasem wygaśnięcia (7 dni)
- ✅ Middleware ochrony tras `/dashboard`
- ✅ Automatyczne czyszczenie wygaśniętych sesji
- ✅ NEXTAUTH_SECRET dla bezpiecznych tokenów
- ✅ Walidacja danych na frontendzie i backendzie

### SQL:
```sql
-- Tabele zawierają:
- users (id, email, name, password_hash, created_at, updated_at)
- sessions (id, user_id, session_token, expires)
- accounts (dla OAuth w przyszłości)
- verification_tokens (dla email verification)
- Indeksy na email, user_id, session_token dla wydajności
```

## 📂 Struktura plików

```
web/
├── src/
│   ├── app/
│   │   ├── api/auth/
│   │   │   ├── __nextauth/authOptions.ts
│   │   │   ├── [...]nextauth]/route.ts
│   │   │   └── register/route.ts
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── layout.tsx
│   │   ├── providers.tsx
│   │   └── page.tsx (home)
│   └── lib/
│       └── db.ts (funkcje DB)
├── middleware.ts (ochrona tras)
├── database.sql (migracja)
└── .env.local (zmienne)
```

## 🔧 API Endpoints

### Rejestracja
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "password123"
}
```

### NextAuth
```
POST /api/auth/callback/credentials
GET /api/auth/session
POST /api/auth/signin
POST /api/auth/signout
```

## ⏱️ Sesja i wygaśnięcie

- **Czas trwania**: 7 dni
- **Update**: Co 1 dzień
- **Strategia**: JWT tokens
- **Wygaśnięcie**: Automatyczne po 7 dniach
- **Logout**: Manualny przycisk logout

## 🐛 Troubleshooting

### Problem: "User not found" przy logowaniu
- Sprawdź czy EMAIL istnieje w bazie
- Sprawdź czy hasło jest poprawne
- Sprawdź połączenie z Neon.tech

### Problem: "Invalid credentials"
- Upewnij się że email i hasło są poprawne
- Sprawdź czy użytkownik został zarejestrowany

### Problem: Błędy przy połączeniu z bazą
- Sprawdź CONNECTION STRING w .env.local
- Sprawdź czy IP jest whitelisted w Neon.tech
- Sprawdź czy migracja SQL została wykonana

### Problem: Brak sesji po logowaniu
- Sprawdź NEXTAUTH_SECRET w .env.local
- Sprawdź czy AuthProvider jest w layout.tsx
- Wyczyść cache przeglądarki

## 🎓 Rozszerzenia

Możesz rozszerzyć system:
1. **OAuth Providers** - Google, GitHub (edytuj authOptions.ts)
2. **Email Verification** - Dodaj weryfikację emaila
3. **Two-Factor Auth** - Bezpieczeństwo na wyższym poziomie
4. **Role-based Access** - Rola admin/user/moderator
5. **Profile Management** - Edycja profilu użytkownika

## 📞 Support

Dla problemów:
1. Sprawdź Neon.tech dokumentację
2. Sprawdź NextAuth.js dokumentację
3. Sprawdź konsolę błędów przeglądarki (F12)
4. Sprawdź server logs w terminalu

---

**Status**: ✅ Pełna implementacja gotowa do użytku
**Ostatnia aktualizacja**: 2025-12-04
