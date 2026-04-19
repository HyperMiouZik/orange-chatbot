import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Shield, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWizard, BESOINS, type UsageId } from "@/hooks/use-wizard";

const USAGES: { id: UsageId; label: string }[] = [
  { id: "streaming", label: "Streaming" },
  { id: "gaming", label: "Gaming" },
  { id: "teletravail", label: "Visio / travail" },
  { id: "basique", label: "Basique" },
];

const OPERATEURS = ["SFR", "Free", "Bouygues", "Sosh", "Autre"];

// ── Shared primitives ──────────────────────────────────────────────────

function AiBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-2 mb-3.5">
      <div className="min-w-[28px] w-7 h-7 rounded-full bg-[#FF7900] flex items-center justify-center mt-0.5 shrink-0">
        <MessageSquare size={13} color="#fff" strokeWidth={2.5} />
      </div>
      <div className="max-w-[82%] px-3.5 py-2.5 rounded-2xl rounded-bl-[4px] bg-gray-100 text-[13.5px] leading-relaxed text-gray-800">
        {children}
      </div>
    </div>
  );
}

function UserBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-end mb-3.5">
      <div className="max-w-[82%] px-3.5 py-2.5 rounded-2xl rounded-br-[4px] bg-[#FF7900] text-[13.5px] leading-relaxed text-white">
        {children}
      </div>
    </div>
  );
}

function QrBtn({
  label,
  onClick,
  primary,
}: {
  label: string;
  onClick: () => void;
  primary?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3.5 py-2 rounded-full text-[12.5px] font-medium border transition-all",
        primary
          ? "bg-[#FF7900] border-[#FF7900] text-white hover:bg-orange-600"
          : "bg-white border-gray-200 text-gray-700 hover:border-[#FF7900] hover:text-[#FF7900]"
      )}
    >
      {label}
    </button>
  );
}

function ActionBtn({
  label,
  onClick,
  primary = false,
  disabled = false,
}: {
  label: string;
  onClick: () => void;
  primary?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "px-4 py-2 rounded-full text-[13px] font-medium border transition-all",
        primary
          ? "bg-[#FF7900] border-transparent text-white hover:bg-orange-600 disabled:opacity-50"
          : "bg-white border-gray-200 text-gray-700 hover:border-gray-400 disabled:opacity-40"
      )}
    >
      {label}
    </button>
  );
}

function UsageChip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 rounded-full text-[12px] font-medium border transition-all",
        selected
          ? "bg-orange-50 border-[#FF7900] text-orange-700"
          : "bg-white border-gray-200 text-gray-600 hover:border-gray-400"
      )}
    >
      {label}
    </button>
  );
}

// ── Step tag label ──────────────────────────────────────────────────

function stepTagLabel(step: number, membresCount: number): string {
  if (step === 1) return `Membre ${membresCount + 1}`;
  if (step === 2) return "Situation actuelle";
  if (step === 3) return "Recommandation";
  if (step === 4) return "Alternative";
  return "";
}

// ── Main wizard shell ──────────────────────────────────────────────────

export function Wizard() {
  const w = useWizard();
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [w.step]);

  const tag = stepTagLabel(w.step, w.membres.length);

  return (
    <div className="w-full max-w-[420px] mx-auto flex flex-col" style={{ padding: "1rem 0" }}>
      <div className="border border-gray-200 rounded-3xl overflow-hidden bg-white shadow-md">
        {/* Header */}
        <div className="bg-[#FF7900] px-4 py-3 flex items-center gap-2.5">
          <MessageSquare size={18} color="#fff" strokeWidth={2} className="shrink-0" />
          <span className="text-[15px] font-medium text-white flex-1">Mon conseiller Orange</span>
          {tag && (
            <span className="text-[11px] text-white/75 bg-white/15 px-2 py-0.5 rounded-full shrink-0">
              {tag}
            </span>
          )}
        </div>

        {/* Content */}
        <div
          ref={contentRef}
          className="p-4 min-h-[460px] overflow-y-auto"
          style={{ maxHeight: 620 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={Math.round(w.step * 10)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              {w.step === 0 && <Step0 w={w} />}
              {w.step === 0.5 && <Step05 w={w} />}
              {w.step === 1 && <Step1 w={w} />}
              {w.step === 2 && <Step2 w={w} />}
              {w.step === 3 && <Step3 w={w} />}
              {w.step === 4 && <Step4 w={w} />}
              {w.step === 5 && <Step5 w={w} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <p className="text-center text-[12px] text-gray-400 mt-2.5">
        Prototype v3 — conversationnel + simulateur familial
      </p>
    </div>
  );
}

// ── Step 0: Greeting ──────────────────────────────────────────────────

function Step0({ w }: { w: ReturnType<typeof useWizard> }) {
  const [freeText, setFreeText] = useState("");

  const handleSend = () => {
    if (freeText.trim()) {
      w.sendFree(freeText);
      setFreeText("");
    }
  };

  return (
    <div>
      <AiBubble>
        Bonjour&nbsp;! Je suis votre conseiller Orange. Je suis là pour vous aider à trouver
        l'offre qui vous correspond vraiment — pas un catalogue, un vrai conseil. 👋
      </AiBubble>
      <AiBubble>Qu'est-ce qui vous amène aujourd'hui&nbsp;?</AiBubble>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {BESOINS.map((b) => (
          <QrBtn key={b.id} label={b.label} onClick={() => w.pickBesoin(b.id)} />
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={freeText}
          onChange={(e) => setFreeText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ou décrivez votre besoin..."
          className="flex-1 px-3.5 py-2 rounded-full border border-gray-200 text-[13px] bg-white text-gray-800 outline-none focus:border-[#FF7900] transition-colors"
        />
        <button
          onClick={handleSend}
          className="w-9 h-9 rounded-full bg-[#FF7900] flex items-center justify-center shrink-0 hover:bg-orange-600 transition-colors"
        >
          <Send size={15} color="#fff" />
        </button>
      </div>
    </div>
  );
}

// ── Step 0.5: Besoin acknowledged ──────────────────────────────────────

function Step05({ w }: { w: ReturnType<typeof useWizard> }) {
  const besoin = BESOINS.find((b) => b.id === w.besoin);
  const botResp = besoin?.response ?? "Parfait, je comprends&nbsp;! On va trouver la meilleure offre pour vous.";

  return (
    <div>
      {w.userMessage && <UserBubble>{w.userMessage}</UserBubble>}
      <AiBubble>{botResp}</AiBubble>
      <AiBubble>
        Pour vous faire la meilleure recommandation, j'ai besoin de connaître un peu votre foyer.
        On y va&nbsp;? Ça prend 2 minutes.
      </AiBubble>
      <div className="flex flex-wrap gap-1.5">
        <QrBtn label="C'est parti →" onClick={w.goToMembers} primary />
      </div>
    </div>
  );
}

// ── Step 1: Add members ──────────────────────────────────────────────────

function Step1({ w }: { w: ReturnType<typeof useWizard> }) {
  const num = w.membres.length + 1;
  const prevMembre = w.membres.length > 0 ? w.membres[w.membres.length - 1] : null;

  return (
    <div>
      {prevMembre ? (
        <AiBubble>
          {prevMembre.nom}, c'est noté&nbsp;! Quelqu'un d'autre à la maison&nbsp;?
        </AiBubble>
      ) : (
        <AiBubble>
          Commençons par les personnes qui vivent chez vous. Qui est le premier membre du foyer&nbsp;?
        </AiBubble>
      )}

      <div className="bg-gray-50 rounded-2xl p-3.5 mb-3">
        <p className="text-[11px] text-gray-500 font-medium mb-2">Membre {num}</p>
        <input
          type="text"
          placeholder="Prénom ou surnom (Maman, Mathis...)"
          value={w.currentMembre.nom}
          onChange={(e) => w.setCurrentNom(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-[13px] mb-3 outline-none focus:border-[#FF7900] bg-white transition-colors"
        />
        <p className="text-[11px] text-gray-500 font-medium mb-2">Ses usages principaux :</p>
        <div className="flex flex-wrap gap-1.5">
          {USAGES.map((u) => (
            <UsageChip
              key={u.id}
              label={u.label}
              selected={w.currentMembre.usages.includes(u.id)}
              onClick={() => w.toggleCurrentUsage(u.id)}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        <ActionBtn label="Ajouter" onClick={w.addMembre} primary />
        {w.membres.length >= 2 && (
          <ActionBtn label="Tout le monde est là →" onClick={w.finishMembres} />
        )}
      </div>

      {w.membres.length > 0 && (
        <div className="bg-gray-50 rounded-xl p-3">
          <p className="text-[11px] text-gray-400 font-medium mb-1.5">Déjà ajoutés :</p>
          {w.membres.map((m, i) => (
            <div key={i} className="text-[12px] text-gray-600 py-0.5">
              <span className="font-medium">{m.nom}</span>
              {m.usages.length > 0 && (
                <span className="text-gray-400">
                  {" "}— {m.usages.map((u) => USAGES.find((x) => x.id === u)!.label).join(", ")}
                </span>
              )}
            </div>
          ))}
          {w.membres.length === 1 && (
            <p className="text-[11px] text-gray-400 mt-1.5">
              Ajoutez un autre membre pour débloquer la finition.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ── Step 2: Operator + budget ──────────────────────────────────────────

function Step2({ w }: { w: ReturnType<typeof useWizard> }) {
  const noms = w.membres.map((m) => m.nom).join(", ");

  return (
    <div>
      <AiBubble>
        Super, j'ai bien {w.membres.length} personne{w.membres.length > 1 ? "s" : ""}&nbsp;: {noms}.
        Dernière étape avant votre recommandation&nbsp;!
      </AiBubble>
      <AiBubble>
        Vous êtes chez quel opérateur actuellement, et vous payez combien à peu près par mois au
        total (box + tous les mobiles)&nbsp;?
      </AiBubble>

      <div className="bg-gray-50 rounded-2xl p-3.5 mb-3">
        <p className="text-[12px] text-gray-500 font-medium mb-2">Opérateur box actuel</p>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {OPERATEURS.map((op) => (
            <UsageChip
              key={op}
              label={op}
              selected={w.operateur === op}
              onClick={() => w.setOperateur(op)}
            />
          ))}
        </div>
        <p className="text-[12px] text-gray-500 font-medium mb-2">Budget mensuel actuel</p>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={20}
            max={150}
            step={5}
            value={w.prixActuel}
            onChange={(e) => w.setPrixActuel(Number(e.target.value))}
            className="flex-1 accent-[#FF7900]"
          />
          <span className="text-[15px] font-semibold text-gray-800 min-w-[46px]">
            {w.prixActuel}€
          </span>
        </div>
      </div>

      <ActionBtn label="Voir ma recommandation →" onClick={w.submitOp} primary />
    </div>
  );
}

// ── Step 3: Recommendation ──────────────────────────────────────────────

function Step3({ w }: { w: ReturnType<typeof useWizard> }) {
  const r = w.reco!.main;
  const prixActuel = w.prixActuel;
  const diff = prixActuel - r.moy!;
  const diffAbs = Math.abs(diff);
  const saving = diff > 0;

  const membresDetail = w.membres
    .map((m) => `${m.nom} (${m.usages.map((u) => USAGES.find((x) => x.id === u)!.label).join(", ")})`)
    .join(", ");

  return (
    <div>
      <AiBubble>
        J'ai analysé votre foyer&nbsp;: {membresDetail}. Voici ce que je vous recommande&nbsp;!
      </AiBubble>

      {/* Main offer */}
      <div className="border-2 border-[#FF7900] rounded-2xl p-3.5 mb-3 bg-white">
        <div className="flex justify-between items-start mb-2.5">
          <div>
            <span className="text-[11px] bg-[#FF7900] text-white px-2 py-0.5 rounded-full font-medium">
              Recommandé pour vous
            </span>
            <h3 className="text-[16px] font-semibold text-gray-900 mt-2 mb-0.5">{r.name}</h3>
            <p className="text-[12px] text-gray-500">{r.desc}</p>
          </div>
          <div className="text-right shrink-0 ml-2">
            <span className="text-[20px] font-semibold text-[#FF7900]">{r.promo}€</span>
            <br />
            <span className="text-[11px] text-gray-400">puis {r.full}€/mois</span>
          </div>
        </div>
        {r.inclus?.map((i, idx) => (
          <div key={idx} className="text-[12px] text-gray-500 py-0.5">
            ✓ {i}
          </div>
        ))}
      </div>

      {/* Why */}
      <div className="bg-orange-50 rounded-xl px-3.5 py-3 mb-3">
        <p className="text-[12px] font-medium text-orange-700 mb-1.5">
          Pourquoi cette offre pour votre foyer&nbsp;?
        </p>
        {r.why?.map((reason, i) => (
          <p key={i} className="text-[12px] text-orange-800 py-0.5 leading-snug">
            → {reason}
          </p>
        ))}
      </div>

      {/* Comparison */}
      <div className="bg-gray-50 rounded-xl px-3.5 py-3 mb-3">
        <p className="text-[12px] font-medium text-gray-800 mb-2">
          Comparaison avec votre situation actuelle
        </p>
        <div className="flex gap-2 mb-2">
          <div className="flex-1 border border-gray-200 rounded-xl p-2 text-center">
            <p className="text-[11px] text-gray-400 mb-1">
              {w.operateur ?? "Votre opérateur"} (actuel)
            </p>
            <p className="text-[18px] font-semibold text-gray-800">
              {prixActuel}€<span className="text-[11px] text-gray-400">/mois</span>
            </p>
          </div>
          <div className="flex-1 border border-[#FF7900] rounded-xl p-2 text-center bg-orange-50">
            <p className="text-[11px] text-orange-600 mb-1">Orange (moy. 12 mois)</p>
            <p className="text-[18px] font-semibold text-[#FF7900]">
              {r.moy}€<span className="text-[11px] text-orange-600">/mois</span>
            </p>
          </div>
        </div>
        <div
          className={cn(
            "text-center py-1.5 rounded-lg",
            saving ? "bg-green-100" : "bg-orange-100"
          )}
        >
          <span
            className={cn(
              "text-[13px] font-medium",
              saving ? "text-green-700" : "text-orange-700"
            )}
          >
            {saving ? "↓" : "↑"} {diffAbs}€/mois d'{saving ? "économie" : "supplément"}
            {saving && ` (${Math.round(diffAbs * 12)}€/an)`}
          </span>
        </div>
      </div>

      {/* Guarantee */}
      <div className="bg-green-50 rounded-xl px-3.5 py-2.5 mb-3 flex gap-2 items-start">
        <Shield size={15} className="text-green-700 shrink-0 mt-0.5" strokeWidth={2.5} />
        <p className="text-[12px] text-green-800 leading-snug">
          <strong>Garantie 30 jours satisfait.</strong> Si l'offre ne vous convient pas, basculez
          vers une autre sans frais pendant le premier mois.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-2">
        <ActionBtn label="Souscrire cette offre" onClick={w.goToSubscribe} primary />
        <ActionBtn label="Voir l'option moins chère" onClick={w.goToAlt} />
      </div>
      <ActionBtn label="Recommencer" onClick={w.resetAll} />
    </div>
  );
}

// ── Step 4: Alternative ──────────────────────────────────────────────────

function Step4({ w }: { w: ReturnType<typeof useWizard> }) {
  const r = w.reco!.main;
  const a = w.reco!.alt;
  const saving = Math.round(r.moy! - a.moyApprox!);
  const allUsages = w.membres.flatMap((m) => m.usages);
  const hasGaming = allUsages.includes("gaming");

  return (
    <div>
      <AiBubble>
        Vous voulez voir moins cher&nbsp;? Bien sûr, je vous montre le compromis en toute
        transparence&nbsp;:
      </AiBubble>

      <div className="border border-gray-200 rounded-2xl p-3.5 mb-3 bg-white">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[11px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">
              Alternative
            </span>
            <h3 className="text-[16px] font-semibold text-gray-900 mt-2 mb-0.5">{a.name}</h3>
            <p className="text-[12px] text-gray-500">{a.desc}</p>
          </div>
          <div className="text-right shrink-0 ml-2">
            <span className="text-[20px] font-semibold text-gray-800">{a.promo}€</span>
            <br />
            <span className="text-[11px] text-gray-400">puis {a.full}€/mois</span>
          </div>
        </div>
      </div>

      <div className="bg-orange-50 rounded-xl px-3.5 py-3 mb-3">
        <p className="text-[12px] font-medium text-orange-700 mb-1.5">
          Ce que vous gagnez et ce que vous perdez
        </p>
        <p className="text-[12px] text-orange-800 mb-1.5 leading-snug">
          ↓ <strong>Économie :</strong> {saving}€/mois en moyenne ({Math.round(saving * 12)}€/an)
        </p>
        <p className="text-[12px] text-orange-800 leading-snug">
          ↑ <strong>Compromis :</strong> {a.compromise}
        </p>
      </div>

      <AiBubble>
        Pour être honnête avec vous&nbsp;: si votre priorité c'est le budget et que{" "}
        {hasGaming ? "personne ne joue en compétitif" : "vos usages restent modérés"}, l'alternative
        peut suffire. Mais si{" "}
        {hasGaming
          ? "le gaming sans lag est important"
          : "toute la famille est connectée le soir en même temps"}
        , la recommandation initiale vaut les {saving}€ de plus par mois. À vous de voir&nbsp;!
      </AiBubble>

      <div className="flex flex-wrap gap-2">
        <ActionBtn label="Prendre l'alternative" onClick={w.goToSubscribe} />
        <ActionBtn label="Revenir à la reco initiale" onClick={w.goToMain} primary />
      </div>
    </div>
  );
}

// ── Step 5: End ──────────────────────────────────────────────────────────

function Step5({ w }: { w: ReturnType<typeof useWizard> }) {
  return (
    <div>
      <AiBubble>
        Excellent choix&nbsp;! En production, vous seriez redirigé vers le tunnel de souscription
        Orange avec votre offre pré-remplie et vos lignes mobiles déjà configurées.
      </AiBubble>
      <AiBubble>
        Merci d'avoir testé Mon Conseiller Orange. J'espère que ça vous a semblé plus simple
        qu'un catalogue&nbsp;! 😊
      </AiBubble>

      <div className="text-center py-4">
        <div className="bg-green-50 rounded-xl px-4 py-2.5 mb-4 inline-block">
          <span className="text-[13px] text-green-800 font-medium">
            Garantie 30 jours — sans risque
          </span>
        </div>
        <br />
        <button
          onClick={w.resetAll}
          className="bg-[#FF7900] text-white border-none px-7 py-2.5 rounded-full text-[14px] font-medium cursor-pointer hover:bg-orange-600 transition-colors"
        >
          Recommencer la démo
        </button>
      </div>

      <p className="text-[11px] text-gray-400 text-center mt-2">
        Prototype — projet design thinking IMT Business School
      </p>
    </div>
  );
}
