# Sauvegarde sur GitHub et synchronisation des données

Ce projet peut utiliser **GitHub** de deux façons :

1. **Sauvegarder le code source** (obligatoire pour un backup)
2. **Synchroniser les données de l'admin** (alternative à Firebase)

---

## Étape 1 : Créer un token GitHub

1. Va sur https://github.com/settings/tokens
2. Clique sur **"Generate new token (classic)"**
3. Donne un nom au token : `Marleine Koula Hair Token`
4. Choisis une expiration (recommandé : **No expiration** pour ne pas avoir à le renouveler)
5. Coche la permission **"repo"** (elle donne l'accès complet aux repositories)
6. Clique sur **"Generate token"**
7. **Copie le token** immédiatement (tu ne pourras plus le voir)

---

## Étape 2 : Créer un repository GitHub

1. Va sur https://github.com/new
2. **Repository name** : `marleine-koula-hair`
3. Laisse **"Public"** ou choisis **"Private"**
4. **Ne coche pas** "Add a README file"
5. Clique sur **"Create repository"**

---

## Étape 3 : Configurer le fichier `.env`

Ajoute ces lignes dans ton fichier `.env` :

```env
# GitHub - sauvegarde du code + synchronisation des données
VITE_GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
VITE_GITHUB_OWNER=ton_nom_utilisateur_github
VITE_GITHUB_REPO=marleine-koula-hair
```

Remplace :
- `ghp_xxxxxxxxxxxxxxxxxxxx` par ton token
- `ton_nom_utilisateur_github` par ton nom d'utilisateur GitHub
- `marleine-koula-hair` par le nom de ton repository

---

## Étape 4 : Pousser le code sur GitHub

Si tu as accès au terminal, exécute ces commandes :

```bash
git remote add origin https://github.com/TON_USERNAME/marleine-koula-hair.git
git branch -M main
git push -u origin main
```

Sinon, donne le token à l'agent pour qu'il pousse le code automatiquement.

---

## Étape 5 : Utiliser GitHub comme synchronisation des données

Quand GitHub est configuré dans le `.env` **et** que Firebase ne l'est pas, le site utilisera automatiquement GitHub pour :

- Stocker les données du site dans un fichier `site-data.json`
- Uploader les images et vidéos dans le dossier `assets/`
- Rendre les modifications visibles par tous les visiteurs

### Avantages de GitHub par rapport à Firebase

- Pas besoin de créer un projet Firebase
- Les données restent dans ton repository GitHub
- Pas de limite de stockage stricte (dans les limites GitHub)

### Inconvénients

- Les fichiers de plus de 100 Mo ne peuvent pas être uploadés
- Chaque modification crée un commit dans le repository
- Moins rapide que Firebase pour les mises à jour fréquentes

---

## 🔒 Sécurité du token

Le token GitHub est une clé privée. Il est stocké dans le fichier `.env` qui **n'est pas envoyé sur GitHub** (il est dans `.gitignore`).

Ne partage jamais ce token publiquement.
