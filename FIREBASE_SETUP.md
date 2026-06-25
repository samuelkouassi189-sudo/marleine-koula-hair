# Configuration Firebase pour Marleine Koula Hair

La configuration Firebase a été intégrée au site. Il ne reste plus qu'à configurer les règles de sécurité dans la console Firebase.

## Étape 1 : Vérifier le projet

Votre projet Firebase est : **marleine-koula-hair**

## Étape 2 : Activer Realtime Database

1. Allez sur [https://console.firebase.google.com/project/marleine-koula-hair/database](https://console.firebase.google.com/project/marleine-koula-hair/database)
2. Cliquez sur **"Créer une base de données"**
3. Choisissez **"Mode verrouillé"** pour commencer
4. Choisissez un emplacement proche de vos visiteurs (ex: `europe-west1`)

### Règles de sécurité

1. Dans Realtime Database, cliquez sur l'onglet **"Règles"**
2. Remplacez le contenu par :

```json
{
  "rules": {
    ".read": true,
    "siteData": {
      ".write": true
    }
  }
}
```

3. Cliquez sur **"Publier"**

## Étape 3 : Activer Firebase Storage

1. Allez sur [https://console.firebase.google.com/project/marleine-koula-hair/storage](https://console.firebase.google.com/project/marleine-koula-hair/storage)
2. Cliquez sur **"Commencer"**
3. Choisissez **"Mode test"**

### Règles de Storage

1. Dans Storage, cliquez sur l'onglet **"Règles"**
2. Remplacez le contenu par :

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if true;
    }
  }
}
```

3. Cliquez sur **"Publier"**

## Étape 4 : Vérifier dans l'admin

1. Allez sur `https://marleine-koula-hair.vercel.app/admin`
2. Connectez-vous avec le code actuel
3. Un badge vert doit apparaître : **"Synchronisation en ligne active"**

Si le badge est jaune **"Mode local"**, vérifiez que les règles de la base de données sont bien publiées.

## Notes importantes

- Les règles `write: true` permettent à quiconque disposant du code admin de modifier les données.
- Pour plus de sécurité, envisagez d'ajouter l'authentification Firebase.
- Le stockage Firebase gratuit est limité à 1 Go au total.
