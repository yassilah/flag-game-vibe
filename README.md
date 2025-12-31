# 🏴 Flaggle - Jeu de Devinettes de Drapeaux

Un jeu interactif de devinettes de drapeaux inspiré de Wordle, construit avec Nuxt 4.

## 🎮 Comment jouer

- Un drapeau mystère est sélectionné aléatoirement
- Vous avez **5 tentatives** pour deviner le bon drapeau
- À chaque tentative, le drapeau mystère se révèle progressivement avec moins de pixelisation
- Utilisez la barre de recherche pour filtrer les pays
- Gagnez en trouvant le bon drapeau avant d'épuiser vos tentatives !

## ✨ Fonctionnalités

- 🎯 Révélation progressive du drapeau (pixelisation qui diminue à chaque essai)
- 🔍 Barre de recherche pour filtrer les pays
- 📊 Historique de vos tentatives
- 🎨 Interface moderne avec Tailwind CSS
- 🔄 Possibilité de recommencer une nouvelle partie
- 📱 Design responsive

## 🛠️ Technologies

- **Nuxt 4** - Framework Vue.js
- **Vue 3** - Framework JavaScript réactif
- **Tailwind CSS** - Framework CSS utility-first
- **Canvas API** - Pour le rendu et la pixelisation des drapeaux
- **flagcdn.com** - API pour les images de drapeaux

## 🚀 Installation et Lancement

### Prérequis

- Node.js 18+ 
- pnpm (ou npm/yarn)

## Setup

Make sure to install dependencies:

```bash
# pnpm
pnpm install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# pnpm
pnpm dev
```

## Production

Build the application for production:

```bash
# pnpm
pnpm build
```

Locally preview production build:

```bash
# pnpm
pnpm preview
```

## 📂 Structure du Projet

```
flag-game/
├── app/
│   ├── components/
│   │   └── FlagGame.vue      # Composant principal du jeu
│   ├── data/
│   │   └── countries.js      # Base de données des pays et drapeaux
│   └── app.vue               # Point d'entrée de l'application
├── public/                    # Fichiers statiques
├── nuxt.config.ts            # Configuration Nuxt
└── package.json              # Dépendances du projet
```

## 🎨 Personnalisation

### Ajouter plus de pays

Modifiez le fichier `app/data/countries.js` pour ajouter de nouveaux pays :

```javascript
{
  code: 'XX',
  name: 'Nom du pays',
  emoji: '🏴',
  flag: 'https://flagcdn.com/w640/xx.png'
}
```

### Modifier le nombre d'essais

Dans `app/components/FlagGame.vue`, changez la valeur de `maxGuesses` :

```javascript
const maxGuesses = 5 // Modifiez ce nombre
```

### Ajuster la pixelisation

Dans la fonction `drawProgressiveFlag()`, modifiez le calcul de `pixelSize` :

```javascript
const pixelSize = Math.max(1, Math.floor(30 * (1 - revealPercentage)))
// Augmentez ou diminuez 30 pour plus ou moins de pixelisation
```

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## 📝 Licence

MIT

## 🎉 Amusez-vous bien !

Bonne chance pour deviner tous les drapeaux ! 🏴‍☠️

Check out the [Nuxt deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

