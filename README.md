# CampusRate
API REST pour aider les étudiants à noter et commenter différents endroits sur leur campus.
CampusRate est la plateforme principale permettant aux étudiants de consulter des endroits et leurs détails, et de laisser des appréciations. Le projet utilise [NestJS](https://nestjs.com/) et TypeScript.

Le projet est encore en développement actif.

## Fonctionnalités
- Consulter différents endroits ou bâtiments du campus et leurs détails, incluant une courte description, la catégorie à laquelle ils appartiennent (ex : Study space), leur statut d'activité, et les services disponibles;
- Laisser et consulter des appréciations sur différents endroits du campus;
- Consulter la note moyenne d'un endroit et le nombre d'appréciations.

## Technologies
- Node.js;
- TypeScript;
- NestJS;
- Eslint

## Prérequis
- Une version de Node compatible avec le ```package.json```;
- npm
- git

Vérifier que l'environnement est prêt avec ces commandes
```
node --version
npm --version
git --version
```
## Installation du projet
Cloner le dépôt :
```
git clone <repository_url>
```
Installer les dépendances :
```
npm install
```
## Configuration
Pour exécuter le projet, s'assurer que les variables d'environnement sont configurées correctement. Se référer au fichier .env.example à cet effet.

Variables requises :
- PORT
- DATA_FILE_PATH (chemin du fichier json dans lequel les données sont lues et écrites)

### NE PAS pousser son propre fichier .env vers le dépôt, ces fichiers sont privés, suivre le .env.example et ne pas pousser le fichier .env réel

## Exécution du projet
### Développement
```npm run start:dev```
### Production
```
npm run build
npm run start:prod
```
Si le port est resté à 3000, accéder au projet à cette adresse une fois qu'il est en cours d'exécution :
```http://localhost:3000/api```
(si un autre port est utilisé, remplacer 3000 par le port utilisé)

## Scripts disponibles
```
npm run start
npm run start:dev
npm run build
npm run lint
npm run test
```

## API
CampusRate expose deux ressources — places et reviews — sous un chemin de base versionné : toutes les routes débutent par ```/api/v1/```, sauf la documentation swagger.

### Places

| Méthode | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/places` | Créer un endroit (place) |
| GET | `/api/v1/places` | Lister les endroits (filtrable par ```category/status```, paginé avec ```page/limit```) |
| GET | `/api/v1/places/:id` | Consulter un endroit |
| PATCH | `/api/v1/places/:id` | Modifier partiellement un endroit |
| DELETE | `/api/v1/places/:id` | Supprimer un endroit (refusé avec 409 si des appréciations y sont associées) |

### Reviews

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/places/:placeId/reviews` | Créer un review pour un endroit |
| GET | `/api/v1/places/:placeId/reviews` | Lister les reviews d'un endroit (paginé avec `page`/`limit`) |
| GET | `/api/v1/reviews/:id` | Consulter un review |
| PATCH | `/api/v1/reviews/:id` | Modifier partiellement un review |
| DELETE | `/api/v1/reviews/:id` | Supprimer un review |

Créer, modifier ou supprimer une appréciation recalcule automatiquement les `averageRating` et `reviewCount` de l'endroit associé.

Les schémas complets des requêtes/réponses, exemples et réponses d'erreur sont documentés dans Swagger UI (voir ci-dessus).

## Justification des choix de conception

| Choice | Justification |
|---|---|
| Resources nommées `places`/`reviews` (anglais, pluriel, minuscules) | convention REST standart; c'est ce que le projet demandait pour rester cohérent dans les routes, le code et la documentation OpenAPI |
| Version notée via `/api/v1/...` | Version dans le chemin, appliquée sur toutes les routes |
| Imbrication: `/places/:placeId/reviews` pour create/list, indépendant `/reviews/:id` pour get/update/delete | Consulter les reviews d'un endroit ou en créer un pour un endroit dépend de l'endroit lui-même, le review n'existe pas sans être attachée à rien donc la route est imbriquée, mais pour cibler un review spécifique, par exemple lors de la supression, on a pas besoin de savoir quel bâtiment le review évalue, donc on a plus besoin d'une route imbriqué |
| `201` + header `Location` | Signale la création de la ressource et retourne au client l'URI de la nouvelle ressource |
| `404` sur un `id`/`placeId` inconnu | La ressource demandée n'existe pas, donc erreur 404 |
| `409` lors de la suppression d'un endroit possédant des appréciations | Conflit avec l'état actuel de la ressource |
| `400` sur un corps invalide, des paramètres de requête invalides (`page`/`limit`/`category`/`status`), ou des propriétés invalides | L'entrée échoue à la validation avant la logique métier |

### Documentation Swagger
``` 
http://localhost:3000/api/docs
```

## Persistance des données
Le projet stocke présentement les données dans un fichier json dédié, mais ceci changera éventuellement pour une base de données dédiée.
