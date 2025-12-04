# ⚙️ INSTALLATION GUIDE - Magazyn App Authentication

Kompletna instrukcja konfiguracji systemu autentykacji Magazyn App.

---

## 📋 WYMAGANIA WSTĘPNE

- Node.js 18+
- npm lub yarn
- Konto na Neon.tech (https://neon.tech)
- Git (opcjonalnie)

---

## 🔧 INSTALACJA KROK PO KROKU

### FAZA 1: Przygotowanie Neon.tech (10 minut)

#### 1.1 Utwórz konto
```
1. Przejdź na https://neon.tech
2. Kliknij "Sign Up"
3. Zaloguj się przez GitHub / Google / Email
```

#### 1.2 Utwórz projekt
```
1. W dashboard kliknij "New Project"
2. Nazwa: "magazyn-app" (lub dowolna)
3. Wybierz region (Europa jeśli jesteś w EU)
4. Kliknij "Create"
5. Czekaj 30-60 sekund na initialized
```

#### 1.3 Skopiuj CONNECTION STRING
```
1. Otwórz projekt
2. Po lewej stronie kliknij "Connection String"
3. Skopiuj cały URL:
   postgresql://neon_user:password@ep-xxxxx.neon.tech/neon_db?sslmode=require
```

---

### FAZA 2: Konfiguracja Projektu (5 minut)

#### 2.1 Otwórz projekt w VSCode
```powershell
cd "C:\Users\kacper\Desktop\magazyn\SSS-Innowacja-Magazyn-App\web"
code .
```

#### 2.2 Edytuj .env.local
```
1. Otwórz plik: web/.env.local
2. Wklej CONNECTION STRING z kroku 1.3:
   DATABASE_URL="postgresql://neon_user:password@ep-xxxxx.neon.tech/neon_db?sslmode=require"
```

#### 2.3 Wygeneruj NEXTAUTH_SECRET
```powershell
# W PowerShell uruchom:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Skopiuj wynik (np: a3f7d8c1b2e9...)
# Wklej do .env.local:
NEXTAUTH_SECRET="a3f7d8c1b2e9..."
```

#### 2.4 Sprawdź .env.local
Powinien wyglądać tak:
```env
DATABASE_URL="postgresql://neon_user:password@ep-xxxxx.neon.tech/neon_db?sslmode=require"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="a3f7d8c1b2e9f4a7b8c9d0e1f2g3h4i5"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="admin123"
```

---

### FAZA 3: Konfiguracja Bazy Danych (5 minut)

#### 3.1 Wykonaj migrację SQL

**Opcja A: Via Neon.tech GUI (ŁATWIEJSZE)**
```
1. W Neon.tech dashboard otwórz projekt
2. Po lewej kliknij "SQL Editor"
3. Otwórz nową query
4. Skopiuj zawartość z: web/database.sql
5. Wklej do SQL Editor
6. Kliknij "Execute"
7. Powinno być "SUCCESS"
```

**Opcja B: Via command line (ZAAWANSOWANE)**
```powershell
# Zainstaluj psql (PostgreSQL client)
# Lub użyj: npm install -g sql-cli

# Wykonaj migrację:
psql "postgresql://neon_user:password@ep-xxxxx.neon.tech/neon_db?sslmode=require" -f web/database.sql
```

#### 3.2 Sprawdź czy tabele były created
W Neon.tech SQL Editor:
```sql
SELECT name FROM sqlite_master WHERE type='table';
-- Powinieneś zobaczyć: users, sessions, accounts, verification_tokens
```

---

### FAZA 4: Instalacja Zależności (2 minuty)

```powershell
# Przejdź do folderu
cd "C:\Users\kacper\Desktop\magazyn\SSS-Innowacja-Magazyn-App\web"

# Zainstaluj pakiety
npm install

# Poczekaj na install (powinno być ~30 sekund)
# Powinieneś zobaczyć: "added XX packages"
```

---

### FAZA 5: Uruchomienie (1 minuta)

```powershell
# W tym samym folderze:
npm run dev

# Powinieneś zobaczyć:
# ▲ Next.js 16.0.6
# - Local:        http://localhost:3000
# ○ Compiling...
# ✓ Compiled successfully in X seconds
```

---

### FAZA 6: Otwórz w Przeglądarce

```
Otwórz: http://localhost:3000
```

Powinieneś zobaczyć **Welcome to Magazyn App** stronę z przyciskami Sign In i Register.

---

## ✅ WERYFIKACJA INSTALACJI

### Test 1: Rejestracja
```
1. Kliknij "Register"
2. Wypełnij:
   - Full Name: "Jan Kowalski"
   - Email: "jan@test.com"
   - Password: "test123456"
   - Confirm: "test123456"
3. Kliknij "Register"
4. ✅ Powinieneś być na /dashboard z twoimi danymi
```

### Test 2: Sesja
```
1. Zamknij przeglądarkę CAŁKOWICIE
2. Otwórz przeglądarkę
3. Przejdź: http://localhost:3000
4. ✅ Powinieneś być automatycznie zalogowany na /dashboard
   (sesja survives!)
```

### Test 3: Logout
```
1. Na /dashboard kliknij "Logout"
2. ✅ Powinieneś wrócić na home page
3. Przejdź: http://localhost:3000/dashboard
4. ✅ Powinieneś być redirectowany na /login
```

### Test 4: Logowanie
```
1. Kliknij "Sign In"
2. Zaloguj się:
   - Email: "jan@test.com"
   - Password: "test123456"
3. ✅ Powinieneś być na /dashboard
```

---

## 🚨 TROUBLESHOOTING

### Problem: "Cannot find module 'next-auth'"
**Rozwiązanie:**
```powershell
npm install
rm -r node_modules
npm install
```

### Problem: "DATABASE_URL not set"
**Rozwiązanie:**
- [ ] Sprawdź czy .env.local istnieje
- [ ] Sprawdź czy DATABASE_URL jest wklejony
- [ ] Sprawdź czy CONNECTION STRING jest prawidłowy
- [ ] Restartuj dev server

### Problem: "User not found" przy logowaniu
**Rozwiązanie:**
- [ ] Sprawdź czy rejestracja się powiodła
- [ ] Sprawdź czy email jest wpisany prawidłowo
- [ ] Sprawdź czy hasło jest prawidłowe
- [ ] Spróbuj się zarejestrować ponownie

### Problem: Baza danych się nie łączy
**Rozwiązanie 1: Sprawdź CONNECTION STRING**
```
- URL powinien zawierać: @ep-xxxxx.neon.tech
- Powinien zawierać: ?sslmode=require
- Nie powinno być spacji
```

**Rozwiązanie 2: Whitelist IP w Neon.tech**
```
1. W Neon.tech Settings → Network Access
2. Kliknij "Allow all"
3. Lub dodaj twoje IP (ipv4.com)
4. Restartuj dev server
```

**Rozwiązanie 3: Sprawdź czy migracja SQL się powiodła**
```
W Neon.tech SQL Editor:
SELECT COUNT(*) FROM users;
-- Jeśli błąd "relation does not exist" - tabela nie istnieje
-- Wykonaj database.sql ponownie
```

### Problem: "Error: NEXTAUTH_SECRET not set"
**Rozwiązanie:**
```
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Skopiuj wynik do .env.local
# Restartuj dev server
```

### Problem: Stara sesja, nie mogę się wylogować
**Rozwiązanie:**
```
1. DevTools (F12)
2. Application → Cookies
3. Usuń wszystkie cookies dla localhost:3000
4. Refresh strony (F5)
5. Powinieneś być wylogowany
```

### Problem: Kompilacja się nie udaje
**Rozwiązanie:**
```powershell
npm run build    # Sprawdź czy kompiluje się
npm run lint     # Sprawdź linting errors
```

---

## 📁 STRUKTURA KATALOGÓW

```
web/
├── .env.local                    ← MUSISZ EDYTOWAĆ
├── database.sql                  ← SQL migracja
├── middleware.ts                 ← Ochrona tras
├── package.json
├── tsconfig.json
├── next.config.ts
└── src/
    ├── app/
    │   ├── api/
    │   │   └── auth/             ← Auth endpoints
    │   ├── login/page.tsx        ← Login page
    │   ├── register/page.tsx     ← Register page
    │   ├── dashboard/page.tsx    ← Admin panel
    │   ├── page.tsx              ← Home page
    │   ├── layout.tsx            ← Root layout
    │   ├── providers.tsx         ← Auth provider
    │   └── globals.css
    └── lib/
        └── db.ts                 ← Database functions
```

---

## 📊 FLOW APLIKACJI

### 1. Pierwsza wizyta:
```
User → http://localhost:3000
↓
home page
↓
"Register" lub "Sign In"
```

### 2. Rejestracja:
```
/register
↓
Formularz rejestracji
↓
POST /api/auth/register
↓
Haszowanie hasła (bcrypt)
↓
Zapis do bazy (users table)
↓
Auto-signin
↓
/dashboard (zalogowany!)
```

### 3. Sesja:
```
Session token w cookie
↓
Trwa 7 dni
↓
Survives browser restart
↓
Auto-refresh co 1 dzień
```

### 4. Logout:
```
/dashboard (kliknij "Logout")
↓
DELETE session token
↓
/home page (wylogowany)
```

---

## 🔐 BEZPIECZEŃSTWO - SPRAWDZENIE

- [x] Hasła są haszowane (bcrypt)
- [x] Sesje wygasają po 7 dniach
- [x] NEXTAUTH_SECRET chroni JWT
- [x] SQL queries są parameterized
- [x] Brak plain text passwords
- [x] Middleware chroni trasy

---

## 🚀 NASTĘPNE KROKI

### Development
```
npm run dev        # Local development
npm run build      # Build for production
npm run start      # Run production build
npm run lint       # Check code quality
```

### Production Deployment

**Vercel (Recommended):**
```bash
# 1. Push do GitHub
git add .
git commit -m "Add auth system"
git push

# 2. Connect z Vercel.com
# Vercel auto-imports z GitHub

# 3. Add env variables w Vercel:
# DATABASE_URL=...
# NEXTAUTH_URL=https://yourdomain.com
# NEXTAUTH_SECRET=...

# 4. Deploy
```

**Own Server:**
```bash
npm run build
npm run start
# Serve na porcie 3000
```

---

## 📞 DOKUMENTACJA

- Pełna dokumentacja: `AUTH_SETUP.md`
- Quick start: `QUICK_START.md`
- README: `README_AUTH.md`
- Ten plik: `INSTALLATION_GUIDE.md`

---

## ✨ READY!

Po wszystkich krokach powinieneś mieć:
- ✅ Działającą rejestrację
- ✅ Działające logowanie
- ✅ 7-dniową sesję
- ✅ Zabezpieczony dashboard
- ✅ Pełny system autentykacji

Powodzenia! 🚀

---

**Ostatnia aktualizacja**: 2025-12-04
**Status**: Production Ready ✅
