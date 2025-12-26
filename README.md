# Lightning⚡ — Cloudflare Pages (Static + Functions)

Ten projekt jest gotowy pod **Cloudflare Pages**:
- `index.html` — statyczna strona
- `functions/order.js` — endpoint backendowy: **POST /order** (wysyła Discord webhook)

## Jak uruchomić
1) Stwórz nowe repo na GitHub i wrzuć zawartość ZIP (root).
2) Cloudflare Dashboard → **Workers & Pages** → **Create** → **Pages** → Connect to Git → wybierz repo.
3) Build settings:
   - Framework preset: **None**
   - Build command: *(puste)*
   - Build output directory: **.**
4) Pages → Settings → Environment variables:
   - Dodaj Secret: `DISCORD_WEBHOOK_URL` = Twój webhook z Discorda
5) Redeploy.

Po deployu:
- Strona: `https://<nazwa>.pages.dev/`
- API: `https://<nazwa>.pages.dev/order` (POST)

## Test API (opcjonalnie)
W konsoli przeglądarki na stronie:
```js
fetch("/order", {method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({packId:"starter", packLabel:"Start", priceLine:"25 PLN", desc:"Test test test"})})
```
