# To do list:

1. Kategorivis översiktsvisning av lederna på gemensam kart vy med särskiljande layout, d.v.s. olika kategorier ska ha olika layout/ nästan klar men behövs mer design

2. Visning av POI (Points Of Interest)/ klar kan behöva mer design

3. Filtrering av POI vid ledstråk baserat på ett angivet geografiskt avstånd.

4. Visning av information knuten till aktuell POI/ klar

5. Visning av bilder knutna till aktuell POI/ klar

6. Möjlighet för besökare att lägga till egna POI markörer under aktuell session;
a. POI markörerna är temporära och sparas inte; är tillgängliga under den aktuella sessionen/ klar men kan behöva mer design
b. POI markörerna sparas permanent och visas i fortsättningen tillsammans med andra markörer

7. Verktygsfält på kartan där man kan filtrera bort/visa leder, kategorier av leder och POI.

8. Ett antal olika varianter på POI ikoner, t.ex. info, matställe, rastplats etc./ klar om vi inte vill ha fler iconer

9. Möjligheten att lägga till nya kategorier och leder.

10. Lägga till namn i json-filerna. /klar

# Bakground:

Applikationen ska utvecklas med ArcGIS API för JavaScript. Eventuella serverlösningar utvecklas med php/MySQL.
Alla funktionaliteter i grön text måste implementeras korrekt för godkänt betyg (E-C).

För ett högre betyg (B-A) ska även funktionaliteter i blå text implementeras och fungera enligt anvisningar.

Geodata för applikationen finns tillgängliga som json filer (vandrings- och cykelleder), och som gpx-filer (kanotleder).

Projektarbetet utförs i grupper bestående av 3-4 studenter.

Arbetet ska utföras enligt principer för agil utveckling. Ni ska använda SCRUM metoden.
https://prod.liveshare.vsengsaas.visualstudio.com/join?3A1D235D6CB30A7AC649EAC3403F56254F4C
http://www.student.hig.se/~22jono03/udgis/Projekt_GIS_Utveckling-main/

# Problem/Buggar:

Biking_elevation161008.json
Österbybruksslingan

radio knappar på skapa egen led och markör (den ska vara i klickad). /löst

skapa en ny kategori ger undefined om man spammar knappen. /löst

fixa css för flikar o knappar som blir för stora/små. /löst

bild laddas inte in för vatten poi. /löst, måste rensa bilder/cache/cookies på webbläsaren

när man skapar permanent punkt men inte väljer någon info så händer det inget på karatn.klar

när man har filtrerat och sen skapar nya markörer så kan man inte hovra på dem

fixa så att leder från firebase får rätt längd

