# 🏴 Flaggle - Jeu de Devinettes de Drapeaux

Un jeu interactif de devinettes de drapeaux inspiré de Wordle, construit avec Nuxt 4.

## 🎮 Comment jouer

- Un drapeau mystère est sélectionné aléatoirement
- Vous avez **5 tentatives** pour deviner le bon drapeau
- À chaque tentative, le jeu compare votre choix avec le drapeau à trouver **pixel par pixel**
- **Pixels verts** : identiques entre les deux drapeaux
- **Pixels transparents** : différents entre les deux drapeaux
- Un **pourcentage de précision** vous indique la similarité
- Utilisez la barre de recherche pour filtrer les pays
- Gagnez en trouvant le bon drapeau avant d'épuiser vos tentatives !

## ✨ Fonctionnalités

- 🎯 **Comparaison pixel par pixel** entre drapeaux
- 📊 **Pourcentage de précision** pour chaque tentative
- 🟢 **Pixels verts** = identiques, ⬜ **Pixels transparents** = différents
- 🔍 Barre de recherche pour filtrer les pays
- 📈 Historique des tentatives avec scores de précision
- 🎨 Interface moderne avec Nuxt UI
- 🔄 Possibilité de recommencer une nouvelle partie
- 📱 Design responsive

## 🛠️ Technologies

- **Nuxt 4** - Framework Vue.js
- **Vue 3** - Framework JavaScript réactif
- **Nuxt UI** - Bibliothèque de composants UI moderne
- **Canvas API** - Pour le rendu et la comparaison des drapeaux
- **Algorithme de comparaison pixel par pixel** - Calcul de similarité entre images
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

### Ajuster la tolérance de comparaison

Dans la fonction `compareFlagsAndDraw()`, modifiez le seuil de tolérance :

```javascript
const threshold = 30 // Seuil de tolérance pour considérer deux pixels comme identiques
// Plus le nombre est bas, plus la comparaison est stricte
```

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## 📝 Licence

MIT

## 🎉 Amusez-vous bien !

Bonne chance pour deviner tous les drapeaux ! 🏴‍☠️

Check out the [Nuxt deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
