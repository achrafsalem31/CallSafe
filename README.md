# CallSafe - Anti-Betrugs Web App

Eine Progressive Web App (PWA) zum Schutz vor Telefonbetrug, speziell entwickelt für Senioren.

# Funktionen

### 1. **Nummernprüfung (Check)**
- Eingabe verdächtiger Telefonnummern
- Farbcodierte Risikoeinschätzung:
  - 🟢 GRÜN: Sicher / Unbekannt
  - 🟡 GELB: Verdächtig gemeldet
  - 🔴 ROT: Bestätigter Betrug
- Klare Begründung und Kategorisierung
- Handlungsempfehlungen

### 2. **Lernbereich (Wissen)**
- 6 themenspezifische Module:
  - Enkeltrick
  - Falsche Polizisten
  - Schockanrufe
  - Bank / TAN-Betrug
  - Tech-Support Betrug
  - Gewinnspiele
- Einfache Sprache für Senioren
- Merksätze & Checklisten
- Offline verfügbar dank PWA

### 3. **Quiz & Simulationen**
- 3-5 praxisnahe Fragen pro Thema
- Sofort-Feedback nach jeder Antwort
- Realitätsnahe Szenarien
- Interaktive Lernkontrolle

### 4. **Meldefunktion**
- Community-Schutz durch Meldungen
- Einfacher Prozess mit Kategorisierung
- Verlinkung zu offiziellen Meldestellen (Bundesnetzagentur)
- Automatische Blacklist-Aktualisierung

### 5. **Admin-Bereich**
- Statistiken (Prüfungen, Meldungen, Quiz)
- Datenbankverwaltung (Whitelist/Blacklist)
- Analytik der Meldungen
- A/B-Test Vorbereitung für Warntexte

### 6. **PWA Features**
- Installierbar ohne App Store
- Offline-Nutzung möglich
- Schnelle Updates
- Barrierefreie Bedienung

## Installation & Nutzung

### Lokale Entwicklung

1. **Dateien in einem Ordner speichern:**
   ```
   betrugsschutz/
   ├── index.html
   ├── style.css
   ├── app.js
   ├── manifest.json
   └── service-worker.js
   ```



### PWA installieren

1. App im Browser öffnen
2. Bei Erscheinen des Install-Prompts auf "Installieren" klicken
3. Oder manuell über Browser-Menü → "App installieren"


## 🎨 Design-Prinzipien

- **Seniorenfreundlich:**
  - Große, klare Schriftarten (min. 18px)
  - Hoher Kontrast
  - Einfache Navigation
  - Keine überwältigenden Informationen

- **Barrierefreiheit:**
  - Klare Farbcodierung
  - Große Touch-Targets
  - Keine Zeitlimits
  - Einfache Sprache

- **Vertrauen:**
  - Warme, beruhigende Farben
  - Klare Statusmeldungen
  - Keine Panikmache
  - Positive Verstärkung

## 💾 Datenstruktur

### LocalStorage
```javascript
// Statistiken
betrugsschutz_stats: {
  totalChecks: number,
  totalReports: number,
  totalQuizzes: number,
  blacklistCount: number
}

// Kategorien
betrugsschutz_categories: {
  enkeltrick: number,
  polizei: number,
  schock: number,
  bank: number,
  techsupport: number,
  gewinnspiel: number,
  sonstiges: number
}
```

### Datenbank (Simulation)
```javascript
// Whitelist - Sichere Nummern
whitelist: [{
  number: string,
  name: string
}]

// Blacklist - Betrugsnummern
blacklist: [{
  number: string,
  category: string,
  reports: number
}]

// Meldungen
reports: [{
  phone: string,
  category: string,
  details: string,
  timestamp: ISO string
}]
```

## 🔧 Anpassungen

### Farben ändern
In `style.css` unter `:root`:
```css
--color-primary: #2d5a3d;  /* Hauptfarbe */
--color-secondary: #d97706; /* Akzentfarbe */
--color-success: #059669;   /* Erfolg */
--color-warning: #f59e0b;   /* Warnung */
--color-danger: #dc2626;    /* Gefahr */
```

### Inhalte aktualisieren
In `app.js` unter `learningContent` und `quizQuestions`:
```javascript
const learningContent = {
  thema: {
    title: 'Titel',
    content: 'HTML Inhalt'
  }
}
```

### Datenbank erweitern
Einfach neue Einträge hinzufügen:
```javascript
database.blacklist.push({
  number: '030 12345678',
  category: 'enkeltrick',
  reports: 5
});
```

#Browser-Kompatibilität

- ✅ Chrome/Edge
- ✅ Firefox 
- ✅ Safari 
- ✅ Chrome Mobile/Safari iOS

## Datenschutz

- Alle Daten werden lokal gespeichert (LocalStorage)
- Keine Server-Kommunikation
- Keine Cookies
- Keine Tracking-Tools
- Vollständig offline nutzbar

## Zukünftige Erweiterungen

- [ ] Backend-Integration für echte Datenbank
- [ ] Push-Benachrichtigungen bei neuen Betrugswellen
- [ ] Spracherkennung für Anruferkennung
- [ ] Community-Features
- [ ] Mehrsprachigkeit
- [ ] Export von Statistiken
- [ ] Integration mit Bundesnetzagentur-API

## Entwickler
Diese App wurde als Studienprojekt entwickelt.

Master IT-Studienprojekt von:
- Achraf Salem
- Saad Ahmito
- Ilyass Seghir

## Support

Bei Fragen oder Problemen:
1. Browserkonsole öffnen (F12)
2. Fehlermeldungen notieren
3. LocalStorage prüfen
4. Cache leeren und neu laden


**Hinweis:** Diese App ersetzt keine offizielle Beratung. Bei Betrugsfällen kontaktieren Sie die Polizei (110) und die Bundesnetzagentur.
