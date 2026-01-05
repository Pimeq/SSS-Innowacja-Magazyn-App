# 🔐 Magazyn App - Authentication System

Pełna implementacja systemu autentykacji w Next.js z NextAuth.js i Neon.tech PostgreSQL.

## ✨ Cechy

- ✅ **Rejestracja użytkowników** - Bezpieczne tworzenie kont
- ✅ **Logowanie** - Email + Hasło (bcrypt)
- ✅ **Sesje trwające 7 dni** - JWT tokens
- ✅ **Panel admina** - Zabezpieczony dashboard
- ✅ **Middleware ochrony** - Automatyczne redirecty
- ✅ **Integracja Neon.tech** - PostgreSQL w chmurze
- ✅ **TypeScript** - Pełna wsparcie typów

## 🚀 Quick Start

### 1. Skonfiguruj Neon.tech
```bash
# Utwórz konto na https://neon.tech
# Skopiuj CONNECTION STRING z dashboarda
```

### 2. Zmień `.env.local`
```bash
cd web
# Edytuj .env.local i wkej:
# DATABASE_URL="postgresql://user:pass@ep-xxx.neon.tech/db?sslmode=require"
# NEXTAUTH_SECRET="(wygeneruj: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")"
```

### 3. Uruchom
```bash
npm install  # jeśli pierwszy raz
npm run dev
# http://localhost:3000
```

## 📋 Instrukcje

Pełne instrukcje w:
- `QUICK_START.md` - Szybki start (3 kroki)
- `AUTH_SETUP.md` - Szczegółowa konfiguracja

## 📂 Struktura

```
web/
├── src/
│   ├── app/
│   │   ├── api/auth/              # NextAuth endpoints
│   │   ├── login/page.tsx         # Strona logowania
│   │   ├── register/page.tsx      # Strona rejestracji
│   │   ├── dashboard/page.tsx     # Panel admina
│   │   ├── providers.tsx          # SessionProvider
│   │   └── layout.tsx             # Root layout
│   └── lib/
│       └── db.ts                  # Funkcje bazy danych
├── middleware.ts                   # Ochrona tras
├── .env.local                      # Zmienne środowiska
└── database.sql                    # Migracja SQL
```

## 🔐 Bezpieczeństwo

- **Hasła** - bcrypt (10 salt rounds)
- **Sesje** - JWT tokens (7 dni)
- **HTTPS** - Ready for production
- **SQL Injection** - Protected queries
- **CSRF** - NextAuth built-in

## 🧪 Testowanie

```bash
# Rejestracja
1. /register
2. Utwórz konto
3. Auto-login → /dashboard

# Logowanie
1. /login
2. Email + Hasło
3. → /dashboard

# Sesja
- Trwa 7 dni
- Survives browser restart
- Logout usuwa sesję
```

## 🔧 API Endpoints

```
POST /api/auth/register          # Rejestracja
POST /api/auth/signin            # Logowanie
GET  /api/auth/session           # Sesja
POST /api/auth/signout           # Logout
GET  /api/auth/callback/credentials
```

## 📦 Zależności

- `next-auth` - Autentykacja
- `@neondatabase/serverless` - Neon client
- `postgres` - PostgreSQL adapter
- `bcrypt` - Haszowanie haseł

## 🚨 Troubleshooting

**"User not found" przy logowaniu**
- Sprawdź czy email istnieje
- Sprawdź czy hasło jest poprawne

**Baza się nie łączy**
- Sprawdź DATABASE_URL
- Whitelist IP w Neon: Settings → Network Access

**Stara sesja po zmianach**
- Wyczyść cookies (DevTools → Application → Cookies)
- Lub użyj Incognito okna

## 📞 Dokumentacja

- [NextAuth.js Docs](https://next-auth.js.org/)
- [Neon.tech Docs](https://neon.tech/docs)
- [Next.js Docs](https://nextjs.org/docs)

## 📝 TODO (Opcjonalne rozszerzenia)

- [ ] OAuth Google/GitHub
- [ ] Email verification
- [ ] Password reset
- [ ] Two-factor authentication
- [ ] User profile management
- [ ] Role-based access control
- [ ] Email notifications

## 📄 Licencja

MIT - Wolny do użytku komercyjnego

---

**Status**: ✅ Production Ready
**Ostatnia aktualizacja**: 2025-12-04
