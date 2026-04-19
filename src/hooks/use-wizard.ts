import { useState } from "react";

export type UsageId = "streaming" | "gaming" | "teletravail" | "basique";
export type BesoinId = "nouveau" | "changer" | "regrouper" | "demenager";

export interface Membre {
  nom: string;
  usages: UsageId[];
}

export interface Offer {
  name: string;
  promo: number;
  full: number;
  desc: string;
  inclus?: string[];
  why?: string[];
  compromise?: string;
  moy?: number;
  cout12?: number;
  moyApprox?: number;
  cout12Approx?: number;
}

export interface Reco {
  main: Offer;
  alt: Offer;
}

export const BESOINS: { id: BesoinId; label: string; response: string }[] = [
  {
    id: "nouveau",
    label: "Prendre un nouveau forfait",
    response: "Un nouveau forfait, c'est noté\u00a0! Fibre, mobile, ou les deux\u00a0? On va voir ça ensemble.",
  },
  {
    id: "changer",
    label: "Changer d'opérateur",
    response: "Vous en avez assez de votre opérateur actuel\u00a0? On va trouver mieux pour vous, promis.",
  },
  {
    id: "regrouper",
    label: "Regrouper box + mobiles",
    response:
      "Tout regrouper au même endroit, bonne idée\u00a0! On va optimiser ça pour tout le foyer.",
  },
  {
    id: "demenager",
    label: "Je déménage bientôt",
    response:
      "Un déménagement, c'est le moment idéal pour repenser son offre. On s'en occupe\u00a0!",
  },
];

export function calcReco(membres: Membre[]): Reco {
  const n = membres.length;
  const allUsages = membres.flatMap((m) => m.usages);
  const hasGaming = allUsages.includes("gaming");
  const hasTeletravail = allUsages.includes("teletravail");
  const heavy = hasGaming || hasTeletravail;

  let main: Offer;
  let alt: Offer;

  if (heavy && n >= 3) {
    main = {
      name: "Livebox Max + Pack Open",
      promo: 54.99,
      full: 72.99,
      desc: "Fibre 5 Gbit/s sym. + Wi-Fi 6E + répéteur",
      why: [
        `Débit symétrique pour ${hasGaming ? "le gaming" : "la visio"} sans lag, même à ${n} simultanés`,
        `Wi-Fi 6E + répéteur : couverture optimale pour ${n} personnes`,
        "Remise Open : -12€/mois par ligne mobile ajoutée",
      ],
      inclus: ["Fibre 5 Gbit/s ↓↑", "Répéteur Wi-Fi 6E", "TV 4K (désactivable)", "Appels illim."],
    };
    alt = {
      name: "Livebox Up + Pack Open",
      promo: 44.99,
      full: 62.99,
      desc: "Fibre 2 Gbit/s + Wi-Fi 6 + répéteur",
      compromise: `Débit 2 Gbit/s au lieu de 5 — suffisant pour le streaming, mais ${
        hasGaming
          ? "latence un peu plus haute en gaming compétitif"
          : "visio peut saturer si tout le foyer streame en même temps"
      }.`,
    };
  } else if (heavy) {
    main = {
      name: "Livebox Max",
      promo: 34.99,
      full: 54.99,
      desc: "Fibre 5 Gbit/s sym. + Wi-Fi 6E",
      why: [
        `Débit symétrique optimal pour ${hasGaming ? "le gaming" : "le télétravail"}`,
        "Latence réduite vs Livebox standard",
        "Meilleur rapport perf/prix pour usage intensif solo",
      ],
      inclus: ["Fibre 5 Gbit/s ↓↑", "Wi-Fi 6E", "Appels illim."],
    };
    alt = {
      name: "Livebox",
      promo: 24.99,
      full: 42.99,
      desc: "Fibre 500 Mbit/s + Wi-Fi 5",
      compromise: `500 Mbit/s couvre la navigation et le streaming classique, mais ${
        hasGaming
          ? "la latence gaming sera sensiblement plus élevée."
          : "la visio peut devenir instable si vous téléchargez en même temps."
      }`,
    };
  } else if (n >= 3) {
    main = {
      name: "Livebox Up + Pack Open",
      promo: 44.99,
      full: 62.99,
      desc: "Fibre 2 Gbit/s + Wi-Fi 6 + répéteur",
      why: [
        `2 Gbit/s partagés entre ${n} personnes = confortable`,
        "Répéteur Wi-Fi inclus pour couvrir toute la maison",
        "Remise Open : -12€/mois par ligne mobile",
      ],
      inclus: ["Fibre 2 Gbit/s", "Répéteur Wi-Fi 6", "160 chaînes TV", "Appels illim."],
    };
    alt = {
      name: "Livebox + Pack Open",
      promo: 34.99,
      full: 52.99,
      desc: "Fibre 500 Mbit/s + Wi-Fi 5",
      compromise: `500 Mbit/s pour ${n} personnes, ça peut saturer aux heures de pointe. Pas de répéteur Wi-Fi inclus non plus.`,
    };
  } else {
    main = {
      name: "Livebox",
      promo: 24.99,
      full: 42.99,
      desc: "Fibre 500 Mbit/s + Wi-Fi 5",
      why: [
        "Suffisant pour votre usage quotidien",
        "Le meilleur prix, sans options superflues",
        "Pas de surcoût pour du débit que vous n'utiliserez pas",
      ],
      inclus: ["Fibre 500 Mbit/s", "Wi-Fi 5", "Appels illim. fixes", "TV en option (+5€)"],
    };
    alt = {
      name: "Livebox Max",
      promo: 34.99,
      full: 54.99,
      desc: "Fibre 5 Gbit/s + Wi-Fi 6E",
      compromise:
        "Plus de débit, mais pour de la navigation et du streaming standard, vous ne verrez pas la différence. +10€/mois en promo.",
    };
  }

  main.cout12 = Math.round(main.promo * 6 + main.full * 6);
  main.moy = Math.round(main.cout12 / 12);
  alt.cout12Approx = Math.round(alt.promo * 6 + alt.full * 6);
  alt.moyApprox = Math.round(alt.cout12Approx / 12);

  return { main, alt };
}

function detectBesoin(text: string): BesoinId {
  const lower = text.toLowerCase();
  if (lower.includes("déménag") || lower.includes("demenag") || lower.includes("emménag") || lower.includes("nouvelle adresse"))
    return "demenager";
  if (lower.includes("regroup") || lower.includes("pack") || lower.includes("box et mobile") || lower.includes("box + mobile") || lower.includes("tout chez"))
    return "regrouper";
  if (lower.includes("changer") || lower.includes("quitter") || lower.includes("marre") || lower.includes("switch"))
    return "changer";
  return "nouveau";
}

const EMPTY_MEMBRE = (): Membre => ({ nom: "", usages: [] });

export function useWizard() {
  const [step, setStep] = useState<number>(0);
  const [besoin, setBesoin] = useState<BesoinId | null>(null);
  const [userMessage, setUserMessage] = useState<string | null>(null);
  const [membres, setMembres] = useState<Membre[]>([]);
  const [currentMembre, setCurrentMembre] = useState<Membre>(EMPTY_MEMBRE());
  const [operateur, setOperateur] = useState<string | null>(null);
  const [prixActuel, setPrixActuel] = useState(70);
  const [reco, setReco] = useState<Reco | null>(null);

  const pickBesoin = (id: BesoinId) => {
    const b = BESOINS.find((x) => x.id === id)!;
    setBesoin(id);
    setUserMessage(b.label);
    setStep(0.5);
  };

  const sendFree = (text: string) => {
    if (!text.trim()) return;
    const detected = detectBesoin(text);
    setBesoin(detected);
    setUserMessage(text.trim());
    setStep(0.5);
  };

  const goToMembers = () => {
    setMembres([]);
    setCurrentMembre(EMPTY_MEMBRE());
    setStep(1);
  };

  const toggleCurrentUsage = (u: UsageId) => {
    setCurrentMembre((prev) => {
      const has = prev.usages.includes(u);
      return { ...prev, usages: has ? prev.usages.filter((x) => x !== u) : [...prev.usages, u] };
    });
  };

  const setCurrentNom = (nom: string) => {
    setCurrentMembre((prev) => ({ ...prev, nom }));
  };

  const addMembre = () => {
    const nom = currentMembre.nom.trim() || `Membre ${membres.length + 1}`;
    const usages = currentMembre.usages.length > 0 ? currentMembre.usages : (["basique"] as UsageId[]);
    setMembres((prev) => [...prev, { nom, usages }]);
    setCurrentMembre(EMPTY_MEMBRE());
    setStep(1);
  };

  const finishMembres = () => setStep(2);

  const submitOp = () => {
    const computed = calcReco(membres);
    setReco(computed);
    setStep(3);
  };

  const goToAlt = () => setStep(4);
  const goToMain = () => setStep(3);
  const goToSubscribe = () => setStep(5);

  const resetAll = () => {
    setStep(0);
    setBesoin(null);
    setUserMessage(null);
    setMembres([]);
    setCurrentMembre(EMPTY_MEMBRE());
    setOperateur(null);
    setPrixActuel(70);
    setReco(null);
  };

  return {
    step,
    besoin,
    userMessage,
    membres,
    currentMembre,
    operateur,
    prixActuel,
    reco,
    pickBesoin,
    sendFree,
    goToMembers,
    toggleCurrentUsage,
    setCurrentNom,
    addMembre,
    finishMembres,
    setOperateur,
    setPrixActuel,
    submitOp,
    goToAlt,
    goToMain,
    goToSubscribe,
    resetAll,
  };
}
