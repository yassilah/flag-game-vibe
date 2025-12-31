# 📖 Documentation Technique - Flaggle

## Architecture du Projet

### Vue d'ensemble

Flaggle est une Single Page Application (SPA) construite avec Nuxt 4, utilisant Vue 3 et Tailwind CSS. Le jeu utilise l'API Canvas pour le rendu graphique et la pixelisation progressive des drapeaux.

### Structure des Fichiers

```
flag-game/
├── app/
│   ├── app.vue                    # Point d'entrée, layout principal
│   ├── components/
│   │   └── FlagGame.vue           # Composant principal du jeu
│   └── data/
│       └── countries.js           # Base de données des pays
├── public/                        # Assets statiques
├── nuxt.config.ts                 # Configuration Nuxt
├── package.json                   # Dépendances
├── README.md                      # Documentation utilisateur
├── ROADMAP.md                     # Idées d'amélioration
└── TECH_DOC.md                    # Ce fichier

```

## Composants

### app.vue

**Rôle** : Layout principal de l'application

**Fonctionnalités** :
- Affichage du titre et de la description
- Conteneur principal avec gradient de fond
- Intégration du composant FlagGame

**Technologies** :
- Vue 3 Composition API
- Tailwind CSS pour le styling

### FlagGame.vue

**Rôle** : Composant principal contenant toute la logique du jeu

**État Réactif** :
```javascript
const maxGuesses = 5                    // Nombre d'essais maximum
const currentGuess = ref(0)             // Essai actuel
const guesses = ref([])                 // Historique des tentatives
const guessedCountries = ref([])        // Codes des pays déjà devinés
const targetCountry = ref(null)         // Pays à deviner
const gameOver = ref(false)             // État de fin de partie
const won = ref(false)                  // Victoire ou défaite
const searchQuery = ref('')             // Recherche de pays
const flagCanvas = ref(null)            // Référence au canvas
const targetFlagImage = ref(null)       // Image du drapeau cible
```

**Fonctions Principales** :

#### initGame()
Initialise une nouvelle partie :
- Sélectionne un pays aléatoire
- Réinitialise tous les états
- Charge l'image du drapeau

#### loadTargetFlag()
Charge l'image du drapeau depuis flagcdn.com :
- Utilise CORS pour permettre la manipulation du canvas
- Déclenche le dessin une fois l'image chargée

#### drawProgressiveFlag()
Dessine le drapeau avec pixelisation progressive :

**Algorithme** :
1. Si aucune tentative : afficher un fond gris
2. Calculer le pourcentage de révélation : `currentGuess / maxGuesses`
3. Dessiner l'image complète
4. Appliquer une pixelisation inversement proportionnelle aux tentatives
5. Taille des pixels : `30 * (1 - revealPercentage)`

**Technique de Pixelisation** :
```javascript
// Pour chaque bloc de pixels
for (let y = 0; y < height; y += pixelSize) {
  for (let x = 0; x < width; x += pixelSize) {
    // Échantillonner la couleur d'un pixel
    const color = getPixelColor(x, y)
    // Remplir tout le bloc avec cette couleur
    fillRect(x, y, pixelSize, pixelSize, color)
  }
}
```

#### makeGuess(country)
Traite une tentative de l'utilisateur :
- Incrémente le compteur de tentatives
- Ajoute le pays à l'historique
- Vérifie si c'est la bonne réponse
- Redessine le drapeau avec moins de pixelisation
- Termine la partie si nécessaire

#### filteredCountries (computed)
Filtre les pays en fonction de la recherche :
- Recherche insensible à la casse
- Recherche dans le nom du pays

## Données

### countries.js

**Structure** :
```javascript
{
  code: 'FR',           // Code ISO 3166-1 alpha-2
  name: 'France',       // Nom du pays en français
  emoji: '🇫🇷',         // Emoji du drapeau
  flag: 'https://...'   // URL de l'image
}
```

**Source des images** : flagcdn.com
- Format : PNG
- Résolution : 640px de largeur
- CDN rapide et fiable

**Nombre de pays** : 71

## Technologies

### Nuxt 4

**Avantages** :
- SSR/SSG natif
- Auto-import des composants
- File-system based routing
- Optimisations de build automatiques

**Configuration** :
```typescript
{
  modules: ['@nuxtjs/tailwindcss'],
  app: {
    head: {
      title: 'Flaggle',
      meta: [...],
      link: [favicon]
    }
  }
}
```

### Vue 3 Composition API

**Pourquoi Composition API** :
- Meilleure réutilisabilité de la logique
- TypeScript-friendly
- Logique regroupée par fonctionnalité
- Performance optimale

**Hooks utilisés** :
- `ref()` : État réactif
- `computed()` : Propriétés calculées
- `onMounted()` : Initialisation du jeu
- `watch()` : Observation de l'image cible

### Tailwind CSS

**Classes principales utilisées** :
- Layout : `flex`, `grid`, `max-w-4xl`
- Spacing : `p-6`, `mb-4`, `gap-3`
- Couleurs : `bg-white`, `text-indigo-900`
- Responsive : `md:grid-cols-3`, `lg:grid-cols-4`
- Effets : `rounded-2xl`, `shadow-xl`, `hover:bg-indigo-50`

### Canvas API

**Utilisation** :
- `drawImage()` : Dessiner l'image du drapeau
- `getImageData()` : Obtenir les pixels
- `fillRect()` : Dessiner des rectangles (pixels)
- `clearRect()` : Effacer le canvas

**Optimisations** :
- Canvas de taille fixe (600x400)
- Algorithme de pixelisation optimisé
- Pas de re-rendu inutile

## Performance

### Optimisations Actuelles

1. **Lazy Loading** : 
   - Les images ne sont chargées que pour le drapeau cible
   - Pas de préchargement de tous les drapeaux

2. **Computed Properties** :
   - Filtrage des pays mis en cache
   - Re-calcul seulement si searchQuery change

3. **Event Handling** :
   - Désactivation des boutons déjà utilisés
   - Vérifications d'état avant actions

### Métriques Cibles

- **First Contentful Paint** : < 1s
- **Time to Interactive** : < 2s
- **Bundle Size** : < 200 KB
- **Images** : ~50 KB par drapeau (optimisé par CDN)

## Améliorations Possibles

### Court Terme

1. **Préchargement** :
   ```javascript
   const preloadImage = (url) => {
     const img = new Image()
     img.src = url
   }
   ```

2. **Service Worker** :
   - Cache des images de drapeaux
   - Mode hors-ligne

3. **Optimisation du Canvas** :
   - Utiliser OffscreenCanvas si disponible
   - Web Workers pour la pixelisation

### Long Terme

1. **State Management** :
   - Pinia pour les statistiques
   - Persistance localStorage

2. **Backend** :
   - API pour le mode quotidien
   - Classements en ligne

3. **Tests** :
   - Vitest pour les tests unitaires
   - Playwright pour les tests E2E

## API Externes

### flagcdn.com

**Endpoints utilisés** :
```
https://flagcdn.com/w640/{code}.png
```

**Exemples** :
- France : `https://flagcdn.com/w640/fr.png`
- Japon : `https://flagcdn.com/w640/jp.png`

**Caractéristiques** :
- Gratuit
- CDN global
- CORS activé
- Formats multiples (PNG, SVG, WebP)

**Alternatives possibles** :
- flagpedia.net
- REST Countries API
- countryflags.io

## Débogage

### Problèmes Courants

#### Le canvas ne s'affiche pas
```javascript
// Vérifier dans onMounted
console.log('Canvas ref:', flagCanvas.value)
console.log('Image loaded:', targetFlagImage.value?.complete)
```

#### Les pays ne se filtrent pas
```javascript
// Debug dans computed
console.log('Query:', searchQuery.value)
console.log('Filtered:', filteredCountries.value.length)
```

#### La pixelisation ne fonctionne pas
```javascript
// Vérifier les dimensions
console.log('Canvas size:', canvas.width, canvas.height)
console.log('Pixel size:', pixelSize)
```

### DevTools

**Vue DevTools** :
- Inspecter l'état réactif
- Voir les événements
- Timeline des re-rendus

**Browser DevTools** :
- Network : Vérifier le chargement des images
- Performance : Profiler drawProgressiveFlag()
- Console : Logs de débogage

## Déploiement

### Build de Production

```bash
pnpm build
```

**Optimisations automatiques** :
- Minification JS/CSS
- Tree-shaking
- Code splitting
- Image optimization

### Hébergement Recommandé

1. **Vercel** :
   - Zero-config Nuxt support
   - Edge Network
   - Analytics gratuits

2. **Netlify** :
   - Déploiement automatique
   - Preview branches
   - Formulaires gratuits

3. **Cloudflare Pages** :
   - CDN global
   - Gratuit illimité
   - Workers pour backend léger

### Variables d'Environnement

Aucune actuellement, mais futures possibilités :
```env
NUXT_PUBLIC_API_URL=https://api.flaggle.com
NUXT_PUBLIC_ANALYTICS_ID=xxx
```

## Contribution

### Setup Développement

```bash
# Cloner le repo
git clone https://github.com/username/flag-game.git

# Installer les dépendances
pnpm install

# Lancer le dev server
pnpm dev
```

### Standards de Code

- **Formatage** : Prettier (à configurer)
- **Linting** : ESLint (à configurer)
- **Commits** : Conventional Commits

### Pull Requests

1. Fork le projet
2. Créer une branche feature
3. Commiter les changements
4. Ouvrir une PR avec description détaillée

## Licence

MIT - Voir LICENSE file

---

**Dernière mise à jour** : 31 décembre 2025
**Version** : 1.0.0
**Auteur** : Yassi Lah
