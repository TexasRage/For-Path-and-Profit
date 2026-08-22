---
publish: true
created: 2026-08-21T04:18:31.750Z
modified: 2026-08-22T02:08:46.781Z
---

```dataviewjs
const p = dv.current();

const card = document.createElement("div");
card.className = "weapon-card";

const image = document.createElement("img");
image.src = app.vault.adapter.getResourcePath("10 - Module/Templates/weapon-card.png");
card.appendChild(image);

const fields = [
    ["weapon-skill", p.skill],
    ["weapon-range", p.range],
    ["weapon-encumbrance", p.encumbrance],
    ["weapon-price", p.price],
    ["weapon-rarity", p.rarity],
    ["weapon-damage", p.damage],
    ["weapon-critical", p.critical],
    ["weapon-hp", p.hp],
    ["weapon-special", p.special]
];

for (const [className, value] of fields) {
    const el = document.createElement("div");
    el.className = className;
    el.textContent = value ?? "—";
    card.appendChild(el);
}

dv.container.appendChild(card);
```
