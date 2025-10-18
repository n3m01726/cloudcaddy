# ☁️ cloudCaddy

**cloudCaddy** est un hub personnel pour connecter, visualiser et gérer plusieurs services cloud depuis une seule interface.
Pensé pour les créatifs, il réunit dans un même espace la navigation visuelle, le partage rapide et la restauration simplifiée de fichiers.

---

## 🚀 Stack technique

**Backend**

* Node.js + Express
* Prisma (SQLite3)
* OAuth2 pour l’authentification multi-cloud

**Frontend**

* React
* TailwindCSS

---

## 🎨 Axes de développement

### 1️⃣ Cloud visuel pour créatifs

* Affichage des fichiers de chaque cloud sous forme de **miniatures**.
* **Tags** et **drag & drop local** au frontend pour déplacer, renommer ou organiser.
* Récupération des fichiers et métadonnées via les **APIs natives** (Google Drive, Dropbox, etc.).

### 2️⃣ Partage éclair pour groupes restreints

* Interface unifiée pour **créer et gérer les liens de partage** existants sur chaque cloud.
* Suivi des **liens expirables** si le service le permet.
* Pas de duplication ni de stockage local : tout est piloté depuis les APIs.

### 3️⃣ Historique + backup simplifié

* Liste des **versions disponibles** d’un fichier (si le cloud supporte le versioning).
* **Restauration** directe d’une version antérieure via l’API.
* Filtrage par **date** ou **tag** pour retrouver et restaurer rapidement.

---

## 🧩 Vision

CloudHub vise à devenir un **panneau de contrôle créatif** : un espace fluide, visuel et interopérable où tous les clouds se parlent enfin entre eux..

Prompt:
```
- Lorsque nécessaire, dis-moi "Hey, ce serait un bon moment de commit !"
- Rappelle aussi de pull avant de commencer et push après avoir fini.
- Suggère de travailler sur une branche pour une nouvelle fonctionnalité.
```
