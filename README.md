# 7945site

**7945site** Node.js ile yazılmış minimal, tek dosyalık HTTP server framework’üdür.  
Express benzeri ama daha hafif, HTML error page ve **res.title / res.red** özellikleri ile birlikte gelir.

---

## 🔹 Özellikler

- GET, POST, DELETE, PULL route desteği
- Wildcard route: `*` → tüm sayfalar
- Query parametre route: `?key` → res.red zorunlu
- `res.title("<Başlık>")` → HTML `<title>` otomatik ekleme
- `res.red("<url>", <saniye>)` → opsiyonel gecikmeli redirect
- HTML error page, stack trace ile gösterim
- kolay anlaşılır

---

## 🔹 Kurulum

```bash
npm install tinyhttp
```

---

## 🔹 Kullanım

```js
const site = require("7945site");
const app = new site();

// GET route
app.get("/", (req, res) => {
  res.title("Ana Sayfa");      // sayfa başlığı
  res.end("Merhaba dünya"); // içerik
});

// Query route, res.red zorunlu
app.get("?deneme", (req, res) => {
  res.red("/404", 2);          // 2 saniye sonra yönlendir
});

app.listen(3000, () => console.log("Server çalışıyor: http://localhost:3000"));
```

veya
```js
const site = require("7945-site");
const app = new site();
const port = 3000; // port "3000" olmak zorunda değil bu sadece örnek

// GET route
app.get("/", (req, res) => {
  res.title("Ana Sayfa");      // sayfa başlığı
  res.end("Merhaba dunya"); // içerik
});

// Query route, res.red zorunlu
app.get("?deneme", (req, res) => {
  res.red("/404", 2);          // 2 saniye sonra yönlendir
});

app.listen(port, () => console.log(`Server çalışıyor: http://localhost:${port}`));
```

---

## 🔹 res.title

`res.title("<Başlık>")` fonksiyonu:

* HTML `<title>` elementini otomatik olarak ekler
* `res.end()` çağrılmadan önce kullanılması yeterlidir
* Örnek:

```js
app.get("/", (req, res) => {
  res.title("Ana Sayfa");
  res.end("İçerik burada");
});
```

---

## 🔹 res.red

`res.red("<url>", <time>)` fonksiyonu:

* `<url>` → yönlendirilecek adres
* `<time>` (opsiyonel) → saniye cinsinden gecikme
* Örnekler:

```js
res.red("/404");       // hemen yönlendir
res.red("/", 3);       // 3 saniye sonra yönlendir
```

---

## 🔹 Error Page

* Kodda hata oluşursa otomatik error page açılır
* Hatalı satır ve stack trace gösterilir
* Yeşil temalı, kodlama dostu tasarım

---

## 🔹 404 hata

* eğer girilen url yanlışsa 404 sayfasını açar
* 404 sayfası ulaşılmaya çalışılan sayfayı gösterir ve yönlendirme yapmaz
* 404 sayfasından hangi sayfanın olmadığını veya yüklenmediği görülebilir

---

## 🔹 Notlar

* Node.js ≥ 14 önerilir
* `url.parse()` yerine modern `URL` kullanılabilir
* `res.end()` çağrısından sonra `res.title()` veya `res.red()` çağrılmaz çünkü `res.end()` son söz sahibidir