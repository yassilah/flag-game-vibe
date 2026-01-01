# 🤝 Guide de Contribution

Merci de votre intérêt pour contribuer à Flaggle ! Ce guide vous aidera à démarrer.

## 🚀 Comment Contribuer

### Signaler un Bug 🐛

1. Vérifiez que le bug n'a pas déjà été signalé dans les Issues
2. Créez une nouvelle Issue avec :
   - Un titre descriptif
   - Les étapes pour reproduire le bug
   - Le comportement attendu vs actuel
   - Des captures d'écran si pertinent
   - Votre environnement (navigateur, OS, version)

### Proposer une Fonctionnalité 💡

1. Ouvrez une Issue pour discuter de la fonctionnalité
2. Expliquez :
   - Le problème que ça résout
   - Comment ça devrait fonctionner
   - Des exemples d'utilisation
3. Attendez les retours avant de commencer le développement

### Soumettre du Code 🔧

#### Setup Initial

```bash
# Forker le repo sur GitHub

# Cloner votre fork
git clone https://github.com/VOTRE-USERNAME/flag-game.git
cd flag-game

# Installer les dépendances
pnpm install

# Créer une branche
git checkout -b feature/ma-super-fonctionnalite
```

#### Développement

1. **Faire vos modifications**
   - Suivez le style de code existant
   - Commentez le code complexe
   - Gardez les commits atomiques

2. **Tester localement**
   ```bash
   pnpm dev
   # Testez manuellement dans le navigateur
   ```

3. **Vérifier la qualité**
   ```bash
   # Build de production (vérifie les erreurs)
   pnpm build
   ```

#### Soumettre une Pull Request

1. **Commit vos changements**
   ```bash
   git add .
   git commit -m "feat: ajouter le mode difficile"
   ```

2. **Push vers votre fork**
   ```bash
   git push origin feature/ma-super-fonctionnalite
   ```

3. **Créer la Pull Request**
   - Allez sur GitHub
   - Cliquez sur "New Pull Request"
   - Remplissez le template de PR

## 📝 Standards de Code

### Convention de Nommage

**Variables & Fonctions** : camelCase
```javascript
const targetCountry = ref(null)
function makeGuess() {}
```

**Composants** : PascalCase
```
FlagGame.vue
CountryList.vue
```

**Fichiers** : kebab-case
```
countries.js
flag-game.vue
```

### Structure Vue Components

```vue
<script setup>
// 1. Imports
import { computed, ref } from 'vue'

// 2. Props & Emits (si nécessaire)
const props = defineProps({})
const emit = defineEmits([])

// 3. État réactif
const myState = ref(0)

// 4. Computed
const myComputed = computed(() => {})

// 5. Fonctions
function myFunction() {}

// 6. Lifecycle hooks
onMounted(() => {})
</script>

<template>
   <!-- Template simple et lisible -->
</template>

<style scoped>
/* Styles spécifiques au composant */
</style>
```

### Messages de Commit

Format : `type: description`

**Types** :
- `feat`: Nouvelle fonctionnalité
- `fix`: Correction de bug
- `docs`: Documentation
- `style`: Formatage (pas de changement de code)
- `refactor`: Refactoring
- `perf`: Amélioration de performance
- `test`: Ajout de tests
- `chore`: Tâches diverses (build, etc.)

**Exemples** :
```
feat: ajouter le mode multijoueur
fix: corriger la pixelisation sur Safari
docs: mettre à jour le README avec les exemples
refactor: simplifier la logique de filtrage
```

## 🎨 Styling avec Tailwind

### Préférez les classes Tailwind

✅ Bien :
```vue
<div class="flex items-center gap-4 p-6 bg-white rounded-lg">
```

❌ Évitez :
```vue
<div class="my-custom-class">
<style>
.my-custom-class {
  display: flex;
  /* ... */
}
</style>
```

### Responsive Design

Utilisez les breakpoints Tailwind :
```vue
<div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
```

## 🧪 Tests (À venir)

Lorsque les tests seront configurés :

```bash
# Tests unitaires
pnpm test

# Tests E2E
pnpm test:e2e

# Coverage
pnpm test:coverage
```

## 📚 Ajouter des Pays

Pour ajouter des pays dans `app/data/countries.js` :

```javascript
{
  code: 'XX',           // Code ISO 3166-1 alpha-2 (OBLIGATOIRE)
  name: 'Nom du Pays',  // Nom en français (OBLIGATOIRE)
  emoji: '🏴',          // Emoji du drapeau (OBLIGATOIRE)
  flag: 'https://flagcdn.com/w640/xx.png'  // URL (OBLIGATOIRE)
}
```

**Ressources** :
- Codes ISO : https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2
- Emojis : https://emojipedia.org/flags/
- Images : https://flagcdn.com/

## 🔍 Review Process

### Critères de Review

Votre PR sera reviewée selon :
1. **Fonctionnalité** : Ça marche comme prévu ?
2. **Code Quality** : Code propre et maintenable ?
3. **Performance** : Pas de régression de performance ?
4. **UX** : Interface intuitive ?
5. **Documentation** : Code commenté si nécessaire ?

### Timeline

- **Review initiale** : Sous 48h
- **Feedback** : Discussion si nécessaire
- **Merge** : Une fois approuvé par un mainteneur

## 💬 Communication

### Channels

- **Issues** : Bugs et fonctionnalités
- **Discussions** : Questions générales
- **Pull Requests** : Review de code

### Soyez Respectueux

- Soyez courtois et constructif
- Acceptez les critiques
- Aidez les autres contributeurs
- Rappelez-vous : on est tous là pour apprendre

## 🎯 Bonnes Premières Contributions

Cherchez les Issues taguées :
- `good first issue` : Parfait pour débuter
- `help wanted` : Nous avons besoin d'aide
- `documentation` : Améliorer la doc

## ❓ Questions ?

N'hésitez pas à :
- Ouvrir une Discussion
- Demander dans une Issue
- Contacter un mainteneur

## 🙏 Remerciements

Merci à tous les contributeurs qui rendent ce projet meilleur !

---

**Happy Coding! 🎉**
