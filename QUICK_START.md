# 🚀 QUICK START - Jak uruchomić autentykację

## ⚡ 3 kroki do działającego systemu

### KROK 1: Skonfiguruj Neon.tech (5 minut)

1. **Utwórz konto**
   - Przejdź na https://neon.tech
   - Zaloguj się przez GitHub/Google lub email

2. **Utwórz projekt**
   - Kliknij "New Project"
   - Nazwa: "magazyn-app" (lub dowolna)
   - Region: wyber najbliższy (np. EU)
   - Kliknij Create

3. **Skopiuj CONNECTION STRING**
   - W Dashboard kliknij na projekt
   - Przejdź do "Connection string"
   - Skopiuj URL który wygląda tak:
     ```
     postgresql://neon_username:password@ep-xxxxx.neon.tech/neon_dbname?sslmode=require
     ```

---

### KROK 2: Skonfiguruj zmienne (.env.local)

1. **Otwórz plik**: `web/.env.local`

2. **Zastąp zawartość**:
   ```env
   # Wklej skopiowany CONNECTION STRING z kroku 1.3
   DATABASE_URL="postgresql://neon_username:password@ep-xxxxx.neon.tech/neon_dbname?sslmode=require"

   # Pozostaw takie samo
   NEXTAUTH_URL="http://localhost:3000"
   
   # Wygeneruj nowy secret (polecenie poniżej)
   NEXTAUTH_SECRET="your-secret-will-go-here"
   ```

3. **Wygeneruj SECRET** - uruchom w PowerShell:
   ```powershell
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   - Skopiuj wynik i wstaw do `NEXTAUTH_SECRET`

---

### KROK 3: Uruchom aplikację

1. **Przejdź do folderu**:
   ```powershell
   cd "C:\Users\kacper\Desktop\magazyn\SSS-Innowacja-Magazyn-App\web"
   ```

2. **Zainstaluj zależności** (jeśli nie zrobiłeś):
   ```powershell
   npm install
   ```

3. **Uruchom dev server**:
   ```powershell
   npm run dev
   ```

4. **Otwórz przeglądarkę**:
   ```
   http://localhost:3000
   ```

---

## ✅ Co powinno działać

1. **Strona główna** - Welcome page
2. **Login** - Przycisk "Sign In"
3. **Register** - Przycisk "Register"
4. **Panel admina** - Po zalogowaniu `/dashboard`

---

## 🧪 Test rejestracji

1. Kliknij **Register**
2. Wypełnij formularz:
   - Full Name: `Jan Kowalski`
   - Email: `jan@example.com`
   - Password: `test123456`
   - Confirm Password: `test123456`
3. Kliknij **Register** -> Powinna być sesja i dashboard

---

## 🧪 Test logowania

1. Kliknij **Sign In**
2. Zaloguj się używając:
   - Email: `jan@example.com`
   - Password: `test123456`
3. Powinno przejść do dashboarda

---

## 🎯 Sesja trwa 7 dni

- Po logowaniu sesja jest aktywna przez **7 dni**
- Jeśli zamkniesz i otworzysz przeglądarkę - sesja zostaje
- Kliknij **Logout** aby się wylogować
- Po logout - wróci do strony głównej

---

## 🚨 PROBLEMY?

### "Cannot read DATABASE_URL" / Baza się nie łączy
- [ ] Sprawdź czy CONNECTION STRING jest wklejony
- [ ] Sprawdź czy `?sslmode=require` jest na końcu
- [ ] Sprawdź czy IP komputera jest whitelisted w Neon
  - W Neon Dashboard: Settings > Network Access
  - Dodaj: `0.0.0.0/0` (lub IP twojego komputera)

### "User not found" przy logowaniu
- [ ] Sprawdź czy email jest wpisany prawidłowo
- [ ] Sprawdź czy hasło jest prawidłowe
- [ ] Upewnij się że użytkownik został zarejestrowany

### Stara sesja po zmianach kodu
- [ ] Wyczyść cookies: DevTools (F12) → Application → Cookies → usuń
- [ ] Albo otwórz nowe Incognito okno

### Błędy TypeScript w edytorze
- [ ] Uruchom: `npm run build`
- [ ] Lub zamknij i otwórz VSCode

---

## 📁 Pliki które zmieniłem

```
✅ Created: web/.env.local
✅ Created: web/database.sql
✅ Created: web/middleware.ts
✅ Created: web/src/app/providers.tsx
✅ Modified: web/src/app/layout.tsx
✅ Modified: web/src/app/page.tsx
✅ Created: web/src/app/login/page.tsx
✅ Created: web/src/app/register/page.tsx
✅ Created: web/src/app/dashboard/page.tsx
✅ Created: web/src/lib/db.ts
✅ Created: web/src/app/api/auth/__nextauth/authOptions.ts
✅ Created: web/src/app/api/auth/[...nextauth]/route.ts
✅ Created: web/src/app/api/auth/register/route.ts
✅ Installed: next-auth, @neondatabase/serverless, postgres, bcrypt
```

---

## 🎓 Co zostało zrobione?

- ✅ System autentykacji NextAuth.js
- ✅ Integracja z Neon PostgreSQL
- ✅ Haszowanie haseł bcrypt
- ✅ Sesja JWT (7 dni)
- ✅ Rejestracja nowych użytkowników
- ✅ Logowanie
- ✅ Panel admina
- ✅ Middleware ochrony tras
- ✅ Redirecty (auth → dashboard, dashboard → login jeśli brak sesji)

---

## 🔐 Bezpieczeństwo

- Hasła są haszowane (nie są przechowywane jako plain text)
- Sesje wygasają po 7 dniach
- HTTPS ready (w produkcji NEXTAUTH_URL powinien być https)
- SQL injection protected (używamy parameterized queries)

---

**Gotowy do produkcji?** 🎉

Gdy wszystko działa:
1. Zmień NEXTAUTH_URL na rzeczywisty URL produkcji
2. Wygeneruj nowy NEXTAUTH_SECRET na serwerze produkcji
3. Wdróż na Vercel / Netlify / własny serwer

Powodzenia! 🚀
