"use strict";

const SAVED_WEEK_PLANS_KEY = "kuechenenergie-week-plans";
const WEEKDAYS = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];
const savedPlansList = document.querySelector("#saved-week-plans-list");
const savedPlanCount = document.querySelector("#saved-plan-page-count");
const savedPlanLabel = document.querySelector("#saved-plan-page-label");
const announcement = document.querySelector("#saved-plans-announcement");
const toast = document.querySelector("#toast");
let toastTimer;
let printCleanup = null;

const allergenLabels = {
  gluten: "Glutenhaltiges Getreide",
  laktose: "Milch / Laktose",
  "nüsse": "Schalenfrüchte",
  soja: "Soja",
  fisch: "Fisch",
  ei: "Ei",
  senf: "Senf",
  sellerie: "Sellerie",
  sesam: "Sesam",
  "erdnüsse": "Erdnüsse",
  krebstiere: "Krebstiere"
};

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;"
  })[character]);
}

function readPlans() {
  try {
    const value = JSON.parse(localStorage.getItem(SAVED_WEEK_PLANS_KEY) || "[]");
    return Array.isArray(value) ? value.filter((plan) => plan && Array.isArray(plan.days)) : [];
  } catch {
    return [];
  }
}

function writePlans(plans) {
  try {
    localStorage.setItem(SAVED_WEEK_PLANS_KEY, JSON.stringify(plans));
    return true;
  } catch {
    showToast("Die Änderung konnte in diesem Browser nicht gespeichert werden.");
    return false;
  }
}

function showToast(message) {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("show");
  toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2400);
}

function courseLabel(course) {
  if (course === "starter") return "Vorspeise";
  if (course === "dessert") return "Dessert";
  if (course === "snack") return "Snack";
  return "Hauptspeise";
}

function dietLabel(diet) {
  if (diet === "vegan") return "Vegan";
  if (diet === "vegetarian") return "Vegetarisch";
  return "Mischkost";
}

function cuisineLabel(cuisine) {
  if (!cuisine || cuisine === "all") return "Küchenstil offen";
  if (cuisine === "saechsisch") return "Typisch sächsisch";
  if (cuisine === "klassisch") return "Modern & klassisch";
  return cuisine.charAt(0).toLocaleUpperCase("de-DE") + cuisine.slice(1);
}

function applianceLabel(appliance) {
  return ({
    auto: "Gerät automatisch",
    induction: "Induktion",
    ceramic: "Ceran",
    hotplate: "Elektrokochplatte",
    oven: "Backofen",
    airfryer: "Heißluftfritteuse",
    microwave: "Mikrowelle",
    gas: "Gas"
  })[appliance] || "Gerät automatisch";
}

function number(value, digits = 0) {
  const parsed = Number(value);
  return new Intl.NumberFormat("de-DE", { maximumFractionDigits: digits }).format(Number.isFinite(parsed) ? parsed : 0);
}

function savedDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Speicherzeit unbekannt";
  return new Intl.DateTimeFormat("de-DE", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
}

function allergensMarkup(meal, planId, dayIndex, mealIndex) {
  const allergens = Array.isArray(meal.allergens) ? meal.allergens : [];
  const panelId = `saved-allergens-${planId}-${dayIndex}-${mealIndex}`.replace(/[^a-zA-Z0-9_-]/g, "-");
  const text = allergens.length
    ? allergens.map((allergen) => allergenLabels[allergen] || allergen).join(", ")
    : "Keine automatisch erfassten Hauptallergene";
  return `
    <button class="saved-plan-allergen-button" type="button" data-saved-allergens="${panelId}" aria-expanded="false" aria-controls="${panelId}">Allergene anzeigen</button>
    <div class="saved-plan-allergen-panel" id="${panelId}" hidden><strong>Hinweis:</strong> ${escapeHtml(text)}. Packungsangaben zusätzlich prüfen.</div>`;
}

function mealMarkup(meal, planId, dayIndex, mealIndex) {
  const macros = meal.macros || {};
  return `
    <article class="saved-plan-meal">
      <small>${escapeHtml(courseLabel(meal.course))}</small>
      <h4>${escapeHtml(meal.title || "Unbenanntes Gericht")}</h4>
      <p>${number(macros.kcal)} kcal · ${number(macros.protein)} g Protein · ${number(meal.time)} Min.</p>
      ${allergensMarkup(meal, planId, dayIndex, mealIndex)}
    </article>`;
}

function dayMarkup(day, planId, fallbackIndex) {
  const dayIndex = Number.isInteger(day.dayIndex) ? day.dayIndex : fallbackIndex;
  const summary = day.summary || {};
  const meals = Array.isArray(day.meals) ? day.meals : [];
  return `
    <section class="saved-plan-day">
      <div class="saved-plan-day-header">
        <strong>${escapeHtml(WEEKDAYS[dayIndex] || `Tag ${dayIndex + 1}`)}</strong>
        <span>${number(summary.kcal)} kcal · ${number(summary.protein)} g Protein · ${number(summary.kwh, 2)} kWh</span>
      </div>
      <div class="saved-plan-meals">
        ${meals.map((meal, mealIndex) => mealMarkup(meal, planId, dayIndex, mealIndex)).join("")}
      </div>
    </section>`;
}

function planMarkup(plan, index) {
  const config = plan.config || {};
  const planId = escapeHtml(plan.id || `plan-${index}`);
  const timeLabel = Number(config.maxTime) >= 60 ? "Zeit offen" : `bis ${number(config.maxTime)} Min.`;
  return `
    <article class="saved-week-card" data-saved-plan="${planId}">
      <div class="saved-week-card-header">
        <div>
          <h3>${escapeHtml(plan.name || "Gespeicherter Wochenplan")}</h3>
          <time datetime="${escapeHtml(plan.savedAt || "")}">Gespeichert: ${escapeHtml(savedDate(plan.savedAt))}</time>
        </div>
        <div class="saved-week-card-actions">
          <button type="button" data-print-plan="${planId}">Plan drucken</button>
          <button type="button" data-delete-plan="${planId}">Löschen</button>
        </div>
      </div>
      <div class="saved-week-meta" aria-label="Einstellungen des Plans">
        <span>${escapeHtml(dietLabel(config.diet))}</span>
        <span>${escapeHtml(cuisineLabel(config.cuisine))}</span>
        <span>${escapeHtml(timeLabel)}</span>
        <span>${escapeHtml(applianceLabel(config.appliance))}</span>
        ${plan.relaxedCuisine || plan.relaxedTime ? "<span>Einzelne Vorgaben behutsam erweitert</span>" : ""}
      </div>
      <details class="saved-week-details">
        <summary>7 Tage ansehen</summary>
        <div class="saved-week-days">
          ${plan.days.map((day, dayIndex) => dayMarkup(day, planId, dayIndex)).join("")}
        </div>
      </details>
    </article>`;
}

function renderPlans() {
  const plans = readPlans();
  savedPlanCount.textContent = String(plans.length);
  savedPlanLabel.textContent = plans.length === 1 ? "gespeicherter Plan" : "gespeicherte Pläne";
  if (!plans.length) {
    savedPlansList.innerHTML = `
      <div class="saved-plans-empty">
        <div><span aria-hidden="true">7</span><h3>Noch keine Woche abgelegt.</h3><p>Erstelle auf der Hauptseite einen Wochenplan und speichere ihn anschließend mit einem Klick.</p><a class="button" href="index.html#menu-planner">Ersten Wochenplan erstellen</a></div>
      </div>`;
    return;
  }
  savedPlansList.innerHTML = plans.map(planMarkup).join("");
}

function deletePlan(id) {
  const plans = readPlans();
  const plan = plans.find((item) => item.id === id);
  if (!plan) return;
  if (!window.confirm(`„${plan.name || "Diesen Wochenplan"}“ wirklich löschen?`)) return;
  const nextPlans = plans.filter((item) => item.id !== id);
  if (!writePlans(nextPlans)) return;
  renderPlans();
  announcement.textContent = "Der Wochenplan wurde gelöscht.";
  showToast("Wochenplan gelöscht");
}

function printPlan(id) {
  const card = [...document.querySelectorAll("[data-saved-plan]")].find((item) => item.dataset.savedPlan === id);
  if (!card) return;
  const details = card.querySelector("details");
  const wasOpen = details?.open;
  card.classList.add("is-printing");
  if (details) details.open = true;
  printCleanup = () => {
    card.classList.remove("is-printing");
    if (details) details.open = Boolean(wasOpen);
    printCleanup = null;
  };
  window.print();
  window.setTimeout(() => printCleanup?.(), 500);
}

savedPlansList.addEventListener("click", (event) => {
  const allergenButton = event.target.closest("[data-saved-allergens]");
  if (allergenButton) {
    const panel = document.getElementById(allergenButton.dataset.savedAllergens);
    const expanded = allergenButton.getAttribute("aria-expanded") === "true";
    allergenButton.setAttribute("aria-expanded", String(!expanded));
    allergenButton.textContent = expanded ? "Allergene anzeigen" : "Allergene ausblenden";
    if (panel) panel.hidden = expanded;
    return;
  }
  const deleteButton = event.target.closest("[data-delete-plan]");
  if (deleteButton) {
    deletePlan(deleteButton.dataset.deletePlan);
    return;
  }
  const printButton = event.target.closest("[data-print-plan]");
  if (printButton) printPlan(printButton.dataset.printPlan);
});

window.addEventListener("afterprint", () => printCleanup?.());
window.addEventListener("storage", (event) => {
  if (event.key === SAVED_WEEK_PLANS_KEY) renderPlans();
});

renderPlans();
