# USER STORIES — Sprint 01 : Authentification

**Projet** : RADAR — Outil de veille concurrentielle propulsé par OpenClaw
**Date** : Mai 2026
**Cadre** : Module M244, ENSA Tétouan
**Document compagnon** : [`SPEC-Sprint01-Authentification.md`](./SPEC-Sprint01-Authentification.md)

---

## PRÉAMBULE — L'HISTOIRE DE KARIM

Karim Berrada est le fondateur de **Marka Logistics**, une PME marocaine de logistique B2B basée à Casablanca. Il a démarré l'entreprise il y a six ans, à 32 ans, avec deux camionnettes et trois clients. Aujourd'hui Marka emploie 35 personnes, opère sur l'axe Casablanca-Tanger-Marrakech, et facture autour de 18 millions de dirhams par an. La direction est petite : Karim au commercial et à la stratégie, son associé Mehdi à l'opérationnel, une DRH, un comptable. Pas de directeur stratégie, pas de cellule veille, pas de cabinet conseil au mois.

Sur le marché logistique marocain, deux types de concurrents grattent ses parts. Les historiques : trois sociétés installées depuis vingt ans, plus grosses, avec des relations clients établies que Karim peut difficilement déloger frontalement. Et les nouveaux entrants : deux startups financées par des VC, tarifées 15% en dessous du marché, qui chassent les comptes mid-market que Karim convoite aussi. Pour rester compétitif, il a besoin de savoir **avant ses clients** quand un concurrent recrute, quand il lève, quand il signe un nouveau marché public. Un ami consultant lui a parlé de RADAR la semaine dernière dans un café à Maârif. « Un agent IA qui surveille tes concurrents tous les jours à 6h, qui te livre un rapport méthodologique style M244, et qui détecte les signaux faibles avant tout le monde. » Karim a noté l'URL sur son carnet, et ce lundi matin, café noir devant son bureau, il décide d'essayer.

Ce document raconte ce qui se passe du point de vue de Karim, depuis le premier clic sur « Créer un compte » jusqu'au moment où il ferme l'onglet le soir, confiant que le radar tournera pendant qu'il dort.

---

## EPIC 1 — L'ARRIVÉE

Karim arrive sur RADAR pour la première fois. Il ne connaît pas le produit. Il a 5 minutes entre deux rendez-vous. Il doit pouvoir créer son compte rapidement, soit avec son Google professionnel pour aller plus vite, soit avec son email Marka. Pas de friction. Pas de formulaire interminable. Surtout pas de demande de carte bancaire. Il veut être opérationnel en moins de 2 minutes.

---

### US-A01 : S'inscrire avec Google OAuth en un clic

**En tant que** Karim, fondateur de Marka Logistics, pressé entre deux rendez-vous client

**Je veux** m'inscrire avec mon compte Google professionnel en un seul clic

**Afin de** gagner du temps et ne pas avoir à retenir un nouveau mot de passe pour un outil que je ne sais pas encore si je vais utiliser à long terme.

**Scénario :**

Karim arrive sur la page `/register` à 9h12 ce lundi. Il voit un écran sombre, élégant, qui n'a rien d'un formulaire administratif marocain habituel. À droite, des arcs concentriques teal qui pulsent doucement, et un point safran qui clignote périodiquement « comme un signal radar qui détecte quelque chose ». Le slogan le frappe : « Aucun mouvement concurrent ne devrait vous prendre par surprise. » Trois badges flottent doucement à droite : `PRICING_CHANGE`, `LEVEE_FONDS`, `RECRUTEMENT`. Il pense : « C'est exactement ce que je veux savoir. »

Au-dessus du formulaire à gauche, il voit le bouton Google : grand, propre, le tout premier élément cliquable. Il clique. La popup Google s'ouvre, il sélectionne `karim@marka-logistics.ma`. Retour automatique sur l'app, son nom et son email sont déjà là, `email_verified` est marqué automatiquement (Google a déjà vérifié). Redirect immédiat vers `/onboarding?step=1`.

Temps total : 9 secondes.

**Critères d'acceptation :**

- Le bouton « S'inscrire avec Google » est le premier élément cliquable du formulaire
- Au clic, la popup OAuth Google s'ouvre
- Le nom et l'email sont récupérés automatiquement depuis le compte Google
- `User.emailVerified` est `true` immédiatement (pas de bannière de vérification)
- Une session est créée et l'utilisateur est auto-connecté
- Redirect vers `/onboarding?step=1`
- Si le compte Google est déjà lié à un utilisateur RADAR existant → login classique sans créer de doublon

> Sprint 01 : ce parcours est mocké (le bouton Google déclenche la même Server Action stub que l'inscription email). L'OAuth Google réel sera branché au sprint 1.5 via Better Auth.

---

### US-A02 : S'inscrire avec email professionnel et mot de passe

**En tant que** Karim, qui préfère séparer ses outils pro de son Google personnel

**Je veux** m'inscrire avec mon email professionnel et un mot de passe que je choisis

**Afin de** garder le contrôle sur mes identifiants et ne pas dépendre de Google si un jour je change de compte.

**Scénario :**

Karim revient sur `/register` une heure plus tard. Cette fois il préfère utiliser son email Marka et un mot de passe dédié. Il scrolle sous le bouton Google et voit le divider « ou » centré sur la ligne grise discrète. Le formulaire reprend : Nom complet, Email professionnel, Mot de passe.

Il tape « Karim Berrada » dans le champ nom. Au blur, l'icône `User` à gauche reste discrète mais à droite apparaît un petit `CheckCircle` en vert teal. Bonne sensation, comme un check au début d'une checklist.

Il tape « karim@marka-logistics.ma » dans email. Même chose : check vert. Le format est validé localement.

Il commence le mot de passe. Il tape « Marka » : la première barre de l'indicateur de force passe rouge `#EF4444`. Trop court. Il continue : « Marka2026 » : la deuxième barre passe orange `#F59E0B`, puis la troisième jaune `#FCD34D`. Caption sous l'indicateur : « Min. 8 caractères, 1 majuscule, 1 chiffre. » Il a tout : 9 caractères, M majuscule, 2026 contient des chiffres. Il rajoute « ! » à la fin, la quatrième barre passe vert `#10B981`.

Il clique « Créer mon compte ». Le bouton change : « Création du compte... » avec un petit spinner qui tourne sur la gauche. 800 ms plus tard, il est redirigé. Il pense : « Ça va vite. »

**Critères d'acceptation :**

- Le formulaire affiche 3 champs : Nom complet, Email professionnel, Mot de passe
- Validation temps réel au blur sur nom (≥ 2 caractères) et email (regex format) → check vert dans le champ
- Indicateur de force du mot de passe : 4 segments horizontaux (rouge → safran → jaune → vert) qui s'allument progressivement à chaque keystroke
- Caption « Min. 8 caractères, 1 majuscule, 1 chiffre » sous l'indicateur
- Toggle eye sur le champ password pour afficher/masquer
- Texte légal sous le bouton, centré, avec liens « Conditions d'utilisation » et « Politique de confidentialité » en teal
- Au clic « Créer mon compte » : bouton disabled + spinner + libellé « Création du compte... »
- Server Action `registerAction` (mock 800ms) → redirect vers `/verify-email`
- Email de vérification envoyé en parallèle (mock sprint 01, Resend sprint 1.5)

---

### US-A03 : Être informé que mon email est déjà utilisé

**En tant que** Karim, qui a peut-être créé un compte il y a longtemps et l'a oublié

**Je veux** voir un message clair m'indiquant que le compte existe déjà

**Afin de** comprendre que je dois me connecter plutôt que recréer un compte.

**Scénario :**

Karim, plus tard dans la semaine, oublie qu'il s'est déjà inscrit. Il revient sur `/register` et tape ses informations. Au clic « Créer mon compte », au lieu de la redirection, un bandeau apparaît en haut du formulaire avec une bordure gauche orange et l'icône `AlertTriangle` : « Cet email est déjà utilisé. » suivi d'un lien teal « Se connecter ? ».

Il clique sur le lien. Il arrive sur `/login` avec son email pré-rempli `karim@marka-logistics.ma`. Il pense : « Ah oui, je me souviens. » Il finit par cliquer « Mot de passe oublié ? » parce qu'il ne se rappelle plus, et c'est l'EPIC 3 qui démarre.

**Critères d'acceptation :**

- Une `InlineAlert` tone="warn" s'affiche en haut du formulaire (au-dessus du bouton Google), border-left 3px safran
- Le texte est : « Cet email est déjà utilisé. » + lien teal « Se connecter ? »
- Le lien navigue vers `/login?email={value}` (pré-remplit le champ email)
- Le formulaire ne se vide pas (le nom et le mot de passe restent saisis si l'utilisateur veut corriger juste l'email)

---

### US-A04 : Basculer vers la connexion depuis l'inscription

**En tant que** Karim, qui se rend compte qu'il a déjà un compte avant de soumettre

**Je veux** un lien évident en bas du formulaire d'inscription pour aller à la page de connexion

**Afin de** changer de page sans avoir à retaper l'URL.

**Scénario :**

Karim a un doute. Il regarde plus bas dans la page. Sous le bouton « Créer mon compte » et le texte légal, il voit une ligne discrète : « Déjà un compte ? **Se connecter** ». Le lien est en teal, légèrement souligné au hover. Il clique, arrive sur `/login`, et son nom et son mot de passe sont effacés (sécurité), seul l'email reste s'il l'avait tapé via le bouton de la US-A03.

**Critères d'acceptation :**

- Un footer line est présent en bas du formulaire d'inscription, centré, Caption 13px
- Le format est : « Déjà un compte ? » (`#94A3B8`) + lien « Se connecter » (`#14B8A6`) → `/login`

---

## EPIC 2 — LE RETOUR

Karim a déjà un compte. Il revient chaque matin pour consulter le digest reçu à 7h et explorer le dashboard. La connexion doit être instantanée, sans friction. C'est le moment où l'utilisateur juge la fluidité quotidienne du produit.

---

### US-A05 : Se connecter avec email et mot de passe

**En tant que** Karim, qui ouvre RADAR à 7h45 chaque matin avec son café

**Je veux** me connecter en moins de 5 secondes

**Afin de** voir le digest du jour avant ma première réunion à 8h30.

**Scénario :**

Karim ouvre `/login` ce mardi matin à 7h47. Il voit la page split : à gauche le formulaire propre, à droite le slogan « Vos concurrents bougent. Radar vous le dit avant tout le monde. » avec les arcs teal qui pulsent. Il pense : « Joli matin, joli message. »

Il tape `karim@marka-logistics.ma`, tabule, tape son mot de passe. Le toggle eye est tentant mais il ne touche pas, le café est encore chaud. Clic « Se connecter ». Le bouton affiche « Connexion... ». 800 ms plus tard, il est sur `/dashboard`. Il voit 7 mouvements détectés pendant la nuit. Le café est toujours chaud.

**Critères d'acceptation :**

- Le formulaire login a 2 champs : Email professionnel, Mot de passe
- Tab order : email → password → toggle eye (skipped via tabIndex=-1) → lien « Mot de passe oublié ? » → bouton « Se connecter »
- Au clic « Se connecter » avec validation OK : bouton disabled + spinner + « Connexion... »
- Server Action `loginAction` (mock 800ms) retourne `{ success: true, redirectTo: "/dashboard" }`
- L'utilisateur est redirigé vers `redirectTo` (priorité : `callbackUrl` query param > `/onboarding` si onboarding non fait > `/dashboard`)

---

### US-A06 : Voir un message d'erreur générique en cas d'identifiants incorrects

**En tant que** Karim, qui s'est trompé de mot de passe

**Je veux** voir un message clair sans qu'on me dise quel champ exactement est faux

**Afin de** ne pas faciliter une attaque par énumération sur la liste des comptes RADAR.

**Scénario :**

Le mardi suivant, Karim tape son mot de passe trop vite. Il a mis « Marka2026 » au lieu de « Marka2026! » (oublié le ! final). Clic « Se connecter ». Au lieu de la redirection, une alerte rouge apparaît en haut du formulaire (au-dessus du bouton Google) : icône `AlertTriangle` rouge + « Email ou mot de passe incorrect ». Border-left 3px rouge. Le formulaire ne se vide pas, ses champs gardent les valeurs.

Il pense : « Ah le ! » Il rajoute le caractère manquant et reclique. Cette fois ça passe.

**Critères d'acceptation :**

- Si la Server Action retourne `{ success: false, error: "INVALID_CREDENTIALS" }` : `InlineAlert` tone="error" s'affiche en haut du formulaire
- Le texte est exactement : « Email ou mot de passe incorrect » (jamais « cet email n'existe pas » ni « mot de passe incorrect »)
- Border-left 3px error `#EF4444`, icône `AlertTriangle` 16px
- Les champs ne se vident pas

---

### US-A07 : Être averti que mon email n'est pas vérifié, sans être bloqué

**En tant que** Karim qui s'est inscrit hier mais n'a pas encore cliqué le lien de vérification

**Je veux** être informé à la connexion sans être empêché d'accéder à mon dashboard

**Afin de** continuer à utiliser RADAR pendant que je fouille mes spams pour retrouver l'email.

**Scénario :**

Karim s'est inscrit hier soir mais n'a pas vérifié son email (il a pris le lien skip « Continuer sans vérifier »). Le lendemain matin, il se reconnecte. La Server Action retourne `{ success: false, error: "EMAIL_NOT_VERIFIED" }`. Une `InlineAlert` tone="warn" apparaît en haut du formulaire avec border-left safran : « Vérifiez d'abord votre email. » suivi d'un lien teal « Renvoyer le lien ».

Il clique sur le lien. Le bouton se transforme en « Renvoyer dans 60s »... Il sait qu'il peut continuer à utiliser le produit (le PRD § 7.2 dit « non bloquante ») mais l'app lui rappelle gentiment.

**Critères d'acceptation :**

- Si la Server Action retourne erreur `EMAIL_NOT_VERIFIED` : `InlineAlert` tone="warn" affichée
- Texte : « Vérifiez d'abord votre email. » + lien teal « Renvoyer le lien »
- Le lien déclenche `resendVerificationAction()` (mock 800ms)
- Un toast confirme « Email envoyé » et le lien se transforme temporairement en compteur

> Sprint 01 : la connexion mock retourne toujours success. L'état `unverified` est testable en passant `?state=unverified` à l'URL pour démo. Au sprint 1.5 (Better Auth), la logique réelle sera branchée.

---

## EPIC 3 — LA SÉCURITÉ

Karim a oublié son mot de passe. Il doit pouvoir le réinitialiser de manière sûre, sans qu'un attaquant puisse abuser du système pour énumérer des comptes RADAR ou pour pirater quelqu'un.

---

### US-A08 : Demander un lien de réinitialisation par email

**En tant que** Karim qui a oublié son mot de passe

**Je veux** demander un lien de réinitialisation depuis la page de connexion

**Afin de** récupérer l'accès à mon compte sans contacter un support.

**Scénario :**

Karim, sur la page `/login` un mercredi matin, ne se rappelle plus du mot de passe. Il a essayé trois variantes, sans succès. Sous le champ password, à droite, il y a un lien teal en petit : « Mot de passe oublié ? ». Il clique.

Il arrive sur `/forgot-password`. Une card centrée sur fond sombre. En haut, un cercle gris foncé avec une icône `KeyRound` teal. Le titre : « Mot de passe oublié ? ». Sous le titre : « Entrez votre email, nous vous enverrons un lien de réinitialisation. »

Il tape son email, clique « Envoyer le lien ». 800 ms plus tard, la card change : l'icône devient une `MailCheck` verte, le titre devient « Email envoyé », et le body confirme : « Vérifiez votre boîte de réception à **karim@marka-logistics.ma**. Le lien expire dans 1 heure. » Sous le body, un bouton secondary « Renvoyer dans 60s » qui décompte chaque seconde. En dessous, un back link « Retour à la connexion ».

Il pense : « Vraiment je devrais utiliser un password manager. »

**Critères d'acceptation :**

- Sur `/login`, un lien « Mot de passe oublié ? » est visible aligné à droite sous le champ password
- Le lien navigue vers `/forgot-password`
- La page `/forgot-password` affiche une card centrée 420px avec `StatusCircle` teal + `KeyRound`
- Titre H2 « Mot de passe oublié ? » + body explicatif
- Au submit avec email valide : Server Action `forgotPasswordAction` (mock 800ms) → bascule en stage `sent`
- État `sent` : icône `MailCheck` verte, titre « Email envoyé », body avec email en bold inline
- `ResendCountdownButton` initialSeconds=60, libellé dynamique « Renvoyer dans Xs » → « Renvoyer l'email » à 0s
- Back link teal « Retour à la connexion » → `/login`
- **Sécurité** : la Server Action retourne `{ success: true }` même si l'email n'existe pas (pas de leak)

---

### US-A09 : Cliquer sur un lien de réinitialisation expiré

**En tant que** Karim qui a reçu le mail mais n'a cliqué que 4 jours plus tard

**Je veux** voir un message clair m'indiquant que le lien a expiré et un moyen d'en redemander un

**Afin de** ne pas perdre du temps à comprendre pourquoi rien ne se passe.

**Scénario :**

Karim a reçu le mail samedi mais ne l'a vu qu'aujourd'hui mercredi. Il clique sur le bouton CTA. Il atterrit sur `/reset-password?token=eyJhbGc...` (token de plus d'une heure). Au lieu du formulaire de nouveau mot de passe, il voit une card avec un cercle gris et l'icône `AlertTriangle` rouge. Titre : « Lien expiré ». Body : « Ce lien de réinitialisation a expiré ou est invalide. » Sous le body, un PrimaryButton « Demander un nouveau lien » → `/forgot-password`.

Il clique le bouton, retape son email, et reprend le flow.

**Critères d'acceptation :**

- L'URL `/reset-password?token=expired` (ou sans token) déclenche l'état `expired`
- Affichage : `StatusCircle` tone="error" + `AlertTriangle` rouge, titre H2 « Lien expiré »
- Body « Ce lien de réinitialisation a expiré ou est invalide. »
- PrimaryButton « Demander un nouveau lien » navigue vers `/forgot-password`

---

### US-A10 : Réinitialiser le mot de passe avec confirmation

**En tant que** Karim qui clique sur le lien dans l'heure qui suit

**Je veux** choisir un nouveau mot de passe et le confirmer

**Afin d'**éviter une faute de frappe qui me bloquerait à nouveau.

**Scénario :**

Karim clique sur le bouton du mail dans la minute qui suit. Il atterrit sur `/reset-password?token=valid_xxx`. Cette fois il voit une card avec une icône `ShieldCheck` teal et le titre « Nouveau mot de passe ». Body : « Choisissez un mot de passe sécurisé pour votre compte. »

Deux champs password successifs : « Nouveau mot de passe » et « Confirmer le mot de passe ». Sur le premier, le `PasswordStrength` apparaît dès qu'il commence à taper. Il tape « MarkaLogistics2026! » : tous les segments en vert.

Sur le second, il tape « MarkaLogistics2026 » (oubli du ! final). Le champ devient rouge avec l'erreur « Les mots de passe ne correspondent pas ». Il rajoute le ! : le champ devient vert avec un check `CheckCircle` 14px à droite.

Il clique « Réinitialiser le mot de passe ». 800 ms plus tard, la card change : icône `CheckCircle` verte, titre « Mot de passe modifié », body « Votre mot de passe a été réinitialisé avec succès. », bouton « Se connecter » → `/login`.

**Critères d'acceptation :**

- L'URL `/reset-password?token=valid` affiche le formulaire en état `form`
- Card avec `StatusCircle` teal + `ShieldCheck`, titre « Nouveau mot de passe »
- Deux `FormInput` password : « Nouveau mot de passe » + « Confirmer le mot de passe »
- `PasswordStrength` sous le premier champ
- Validation match temps réel sur le second :
  - Si `pw === confirm` : border verte + icône `CheckCircle` 14px trailing en `#10B981`
  - Si `pw !== confirm` (et confirm non vide) : border rouge + erreur « Les mots de passe ne correspondent pas »
- PrimaryButton « Réinitialiser le mot de passe » avec validation Zod (refine sur match)
- Après submit OK (mock 800ms) : état `success` avec `CheckCircle` vert + titre « Mot de passe modifié » + bouton « Se connecter » → `/login`
- Le token est invalidé après usage (sprint 1.5)

---

## EPIC 4 — LA TRANSITION

Après l'inscription, Karim doit confirmer son email puis être redirigé vers l'onboarding. La friction doit être minimale : le PRD impose une vérification non-bloquante, donc Karim peut sauter l'étape s'il veut.

---

### US-A11 : Vérifier mon email en cliquant le lien

**En tant que** Karim qui vient de s'inscrire

**Je veux** confirmer mon email en cliquant le lien dans le mail Resend

**Afin d'**activer toutes les fonctionnalités et faire disparaître la bannière de rappel.

**Scénario :**

Quelques minutes après l'inscription, Karim ouvre Gmail. Il voit l'email RADAR : « Vérifiez votre adresse email — RADAR ». Il l'ouvre. Le mail est court, propre, en noir et teal. Il y a un gros bouton CTA teal « Vérifier mon email ». Il clique.

Il atterrit sur `/verify-email?token=valid_yyy`. Une card avec un `CheckCircle` vert apparaît directement. Titre : « Email vérifié ». Body : « Ton compte est désormais entièrement actif. » Bouton « Aller au dashboard ». Il clique. Il arrive sur `/dashboard` (ou `/onboarding` s'il n'a pas encore complété).

**Critères d'acceptation :**

- L'URL `/verify-email?token=valid` affiche directement l'état `success`
- Card avec `StatusCircle` tone="success" + `CheckCircle` vert
- Titre H2 « Email vérifié », body « Ton compte est désormais entièrement actif. »
- PrimaryButton « Aller au dashboard » → `/dashboard`
- Si le token est `?token=invalid` : état `invalid` avec `AlertTriangle` rouge + titre « Lien invalide » + body « Ce lien de vérification a expiré ou a déjà été utilisé. » + SecondaryButton « Renvoyer un nouveau lien »

---

### US-A12 : Continuer sans vérifier mon email (vérification non-bloquante)

**En tant que** Karim qui vient de s'inscrire mais qui veut tester RADAR maintenant

**Je veux** pouvoir continuer vers le dashboard sans cliquer le lien de vérification

**Afin d'**explorer le produit immédiatement et faire la vérification plus tard.

**Scénario :**

Karim vient de cliquer « Créer mon compte ». Il est redirigé sur `/verify-email`. La card affiche l'icône `Mail` teal, le titre « Vérifiez votre email », et un body : « Nous avons envoyé un lien de confirmation à **karim@marka-logistics.ma**. Clique dessus pour valider ton compte. »

Il y a un bouton secondary « Renvoyer dans 60s » qui décompte. Mais en dessous, un lien gris discret, presque invisible : « Continuer vers le dashboard sans vérifier ». Il pense : « Je verrai mon mail plus tard. » Il clique le lien. Il arrive sur `/dashboard` (ou `/onboarding` si pas fait).

Plus tard dans la matinée, il verra une bannière persistante au-dessus du dashboard : « Vérifiez votre adresse email pour sécuriser votre compte. » avec un bouton « Renvoyer le lien ». Il pourra la dismiss avec un X (cookie 24h) ou cliquer pour vérifier. La fonctionnalité est non-bloquante mais persistante. Il finira par cliquer dans la journée.

**Critères d'acceptation :**

- État `default` de `/verify-email` : `StatusCircle` teal + `Mail`, titre « Vérifiez votre email »
- Body avec email en bold inline
- `ResendCountdownButton` 60s
- **Lien discret « Continuer vers le dashboard sans vérifier »** (Caption 13px gris, hover blanc, padding-y 10px) → `/dashboard`
- La bannière persistante de rappel au dashboard est traitée dans **BLOC-03 Dashboard** (déjà spec, hors scope sprint 01)

---

## ÉPILOGUE

À 8h17 ce mardi matin, Karim a son compte créé, son email vérifié, son onboarding terminé (3 concurrents ajoutés, 3 axes activés). Il a vu les arcs teal pulser pendant qu'il complétait les étapes. La phrase « Votre radar est armé » lui revient en tête quand il rouvre l'app à 18h, juste avant de partir. Il a confiance : demain matin à 6h, l'agent IA tournera. À 7h, le digest arrivera dans sa boîte. Il aura ses premiers mouvements détectés sur Marka Logistics avant de prendre sa première réunion.

Pas de carte bancaire demandée. Pas de cabinet conseil au mois. Pas de demi-journée perdue à scroller LinkedIn. Le radar veille pendant qu'il dort.

C'est exactement ce qu'il voulait.

---

**Fin des User Stories Sprint 01.** Document compagnon : [`SPEC-Sprint01-Authentification.md`](./SPEC-Sprint01-Authentification.md). Sprint suivant : Sprint 02 Onboarding (`docs/Sprint-02/...` à venir).
