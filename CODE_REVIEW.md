# Code review — `index.html`

## Podsumowanie
Przejrzałem strukturę HTML/CSS/JS i znalazłem kilka obszarów do poprawy. Najważniejsze ryzyka dotyczą dostępności (a11y), łatwości utrzymania i bezpieczeństwa renderowania danych.

## Znalezione problemy

### 1) Brak etykiet dostępności dla przycisków ikonowych (a11y)
**Priorytet:** średni  
**Wpływ:** Użytkownicy czytników ekranu nie dostają informacji, do czego służą przyciski nawigacji slidera/lightboxa.

Przyciski strzałek zawierają tylko SVG i nie mają `aria-label` ani ukrytego tekstu dostępności (`sr-only`).

**Miejsca:**
- slider: przyciski poprzedni/następny,
- lightbox: przyciski poprzedni/następny.

**Rekomendacja:** Dodać np. `aria-label="Previous slide"`, `aria-label="Next slide"`, analogicznie dla lightboxa.

---

### 2) Mieszanie danych z prezentacją przez `innerHTML`
**Priorytet:** średni  
**Wpływ:** Trudniejsze utrzymanie oraz potencjalny wektor XSS, jeśli źródło danych kiedykolwiek przestanie być w pełni kontrolowane.

Kod buduje legendę i detale lightboxa przez składanie stringów HTML i wstawianie ich przez `innerHTML`.

**Miejsca:**
- generowanie legend (`container.innerHTML = html`),
- renderowanie specyfikacji w lightboxie (`lb-specs`).

**Rekomendacja:**
- Generować węzły DOM przez `createElement` i `textContent`.
- Jeśli konieczne pozostaje HTML (np. `<br>`), sanitizować dane i trzymać je w zaufanym, zamkniętym źródle.

---

### 3) Powtórzona logika otwierania lightboxa
**Priorytet:** niski  
**Wpływ:** Większa podatność na regresje i niespójności przy dalszym rozwoju.

Logika ustawiania `src`, `alt`, tytułu/specyfikacji i resetu formularza występuje wielokrotnie (siatka, slider, sekcja about).

**Rekomendacja:**
- Wydzielić jedną funkcję pomocniczą, np. `populateLightbox({src, alt, titleOverride, specsOverride})`,
- Użyć jej we wszystkich trzech ścieżkach.

## Szybkie plusy
- Dobra responsywność (media queries) i spójny styl wizualny.
- Sensowne użycie `loading="lazy"` / `decoding="async"` dla obrazów.
- Czytelny podział sekcji i funkcji JS.
