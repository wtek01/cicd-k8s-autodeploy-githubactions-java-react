# Documentation Complète sur les Environnements d'Exécution

## Aperçu des Environnements

L'application utilise une architecture multi-environnement qui permet de s'exécuter efficacement dans différents contextes. Chaque environnement a sa propre configuration, URLs de services et mécanismes de déploiement.

| Environnement | Description                                 | URL Frontend                   | Configuration   |
| ------------- | ------------------------------------------- | ------------------------------ | --------------- |
| Development   | Environnement local pour le développement   | http://localhost:3000          | Vite Dev Server |
| Docker        | Conteneurs Docker pour tester l'intégration | http://docker.frontend.com     | Nginx           |
| Kubernetes    | Orchestration K8s pour déploiement scalable | http://app.microservices.local | Ingress         |
| Production    | Environnement de production                 | https://app.yourdomain.com     | CDN/Nginx       |

## 1. Structure de Configuration des Environnements

### 1.1. Fichiers de Configuration TypeScript

Les configurations spécifiques à chaque environnement sont définies dans des fichiers TypeScript :

```
frontend/src/config/environments/
├── development.ts
├── docker.ts
├── kubernetes.ts
└── production.ts
```

**Exemple - `development.ts`:**

```typescript
export default {
  userServiceUrl: "http://localhost:8081",
  orderServiceUrl: "http://localhost:8082",
  frontendUrl: "http://localhost:3000",
};
```

### 1.2. Fichiers d'Environnement Vite

Les variables d'environnement de build sont définies dans les fichiers `.env.*` :

```
frontend/
├── .env.development
├── .env.docker
├── .env.kubernetes
└── .env.production
```

**Exemple - `.env.docker`:**

```
VITE_ENVIRONMENT=docker
VITE_USER_SERVICE_URL=http://localhost:8081
VITE_ORDER_SERVICE_URL=http://localhost:8082
VITE_FRONTEND_URL=http://docker.frontend.com
```

### 1.3. Configuration d'Environnement Unifiée

Le fichier `frontend/src/config/env.ts` combine toutes les sources de configuration :

```typescript
const config: Config = {
  userServiceUrl:
    runtimeConfig.USER_SERVICE_URL ||
    env.VITE_USER_SERVICE_URL ||
    configMap[currentEnv].userServiceUrl,

  orderServiceUrl:
    runtimeConfig.ORDER_SERVICE_URL ||
    env.VITE_ORDER_SERVICE_URL ||
    configMap[currentEnv].orderServiceUrl,

  frontendUrl:
    runtimeConfig.FRONTEND_URL ||
    env.VITE_FRONTEND_URL ||
    configMap[currentEnv].frontendUrl,

  environment: currentEnv,
  // Autres propriétés...
};
```

## 2. Méthode des Variables d'Environnement à l'Exécution du Conteneur avec Nginx

### 2.1. Principe de Fonctionnement

L'architecture utilise une approche avancée appelée "Environment Variables at Container Runtime with Nginx" qui permet de configurer dynamiquement l'application sans reconstruire l'image Docker.

```
┌─────────────────────────────────┐
│ Conteneur Docker Frontend        │
│                                 │
│  ┌─────────────┐ Génère  ┌─────────────────┐
│  │ Variables   │───────▶│ config.js        │
│  │ d'Environ.  │        │ (window.__ENV)   │
│  └─────────────┘        └─────────────────┘
│         │                        ▲
│         │                        │
│         ▼                        │
│  ┌─────────────┐         ┌─────────────┐
│  │docker-      │ Utilise │ Template    │
│  │entrypoint.sh│◀────────│ Nginx       │
│  └─────────────┘         └─────────────┘
│         │                        ▲
│         │                        │
│         ▼                        │
│  ┌─────────────┐         ┌─────────────────┐
│  │ default.conf │ Utilisé │ Application     │
│  │ (Nginx)     │ par     │ React (statique) │
│  └─────────────┘────────▶└─────────────────┘
└─────────────────────────────────┘
```

### 2.2. Processus d'Injection de Configuration

Au démarrage du conteneur, le script `docker-entrypoint.sh` :

1. **Génère un fichier `config.js`** qui expose les variables d'environnement au navigateur :

   ```javascript
   window.__ENV = {
     USER_SERVICE_URL: "http://localhost:8081",
     // Autres variables...
   };
   ```

2. **Traite la configuration Nginx** en remplaçant les variables par leurs valeurs réelles :

   ```bash
   envsubst '${USER_SERVICE_URL} ${ORDER_SERVICE_URL}' < template > default.conf
   ```

3. **Démarre Nginx** avec la configuration générée.

### 2.3. Avantages de Cette Approche

- **Une seule image, multiples environnements** : Évite de reconstruire pour chaque environnement
- **Configuration sans redéploiement** : Changez les URLs simplement en modifiant les variables
- **Flexibilité maximale** : S'adapte à différentes topologies réseau
- **Sécurité améliorée** : Les variables sensibles peuvent venir de gestionnaires de secrets

## 3. Environnement de Développement (Development)

### 3.1. Configuration

**URLs des Services:**

- Frontend: `http://localhost:3000`
- User Service: `http://localhost:8081`
- Order Service: `http://localhost:8082`

**Méthode d'Exécution:**

- Serveur de développement Vite
- Services backend en direct sur la machine locale

### 3.2. Comment Démarrer

```bash
# Terminal 1 - Frontend
cd frontend
npm run dev

# Terminal 2 - User Service
cd backend/user-service
./mvnw spring-boot:run

# Terminal 3 - Order Service
cd backend/order-service
./mvnw spring-boot:run
```

### 3.3. Fonctionnement Technique

1. Vite Dev Server démarre sur le port 3000
2. Les requêtes API sont envoyées directement du navigateur aux services backend
3. Le rechargement à chaud (HMR) est activé pour le développement
4. Les variables d'environnement proviennent de `.env.development`

## 4. Environnement Docker

### 4.1. Configuration

**URLs des Services:**

- Frontend: `http://docker.frontend.com` ou `http://localhost`
- User Service: `http://localhost:8081`
- Order Service: `http://localhost:8082`

**Méthode d'Exécution:**

- Nginx dans le conteneur frontend
- Services dans des conteneurs Docker
- Communication via le réseau Docker et ports exposés

### 4.2. Comment Démarrer

```bash
# Ajouter au fichier hosts
# 127.0.0.1 docker.frontend.com

# Démarrer tous les services
cd /chemin/vers/projet
docker-compose -f infrastructure/docker/docker-compose.yml up -d
```

### 4.3. Fonctionnement Technique

1. Le conteneur frontend utilise Nginx pour servir l'application et gérer les routes
2. `docker-entrypoint.sh` génère la configuration runtime à partir des variables d'environnement
3. Nginx redirige les requêtes API vers les services backend
4. Configuration dans `/frontend/nginx/default.conf`

**Flux de requêtes:**

```
Navigateur → Nginx (docker.frontend.com) → Service Backend (via proxy_pass)
```

### 4.4. Utilisation des Variables d'Environnement au Runtime

Dans l'environnement Docker, les variables sont injectées lors du démarrage du conteneur :

```yaml
# docker-compose.yml
environment:
  ENVIRONMENT: docker
  USER_SERVICE_URL: "http://localhost:8081"
  ORDER_SERVICE_URL: "http://localhost:8082"
  FRONTEND_URL: "http://docker.frontend.com"
```

Le script `docker-entrypoint.sh` transforme ces variables en configuration utilisable :

```bash
cat <<EOF > /usr/share/nginx/html/config.js
window.__ENV = {
  // URLs for service communication
  USER_SERVICE_URL: "${USER_SERVICE_URL:-http://localhost:8081}",
  ORDER_SERVICE_URL: "${ORDER_SERVICE_URL:-http://localhost:8082}",
  FRONTEND_URL: "${FRONTEND_URL:-http://docker.frontend.com}",

  // Environment information
  ENVIRONMENT: "${ENVIRONMENT:-docker}",
  VERSION: "${VERSION:-1.0.0}"
};
EOF
```

## 5. Environnement Kubernetes

### 5.1. Configuration

**URLs des Services:**

- Frontend: `http://app.microservices.local`
- User Service: `http://api.microservices.local/users`
- Order Service: `http://api.microservices.local/orders`

**Méthode d'Exécution:**

- Pods Kubernetes pour chaque service
- Ingress Controller pour le routage
- Services K8s pour la découverte de service

### 5.2. Comment Démarrer

```bash
# Appliquer les configurations Kubernetes
kubectl apply -f kubernetes/frontend-deployment.yaml
kubectl apply -f kubernetes/backend-deployment.yaml
kubectl apply -f kubernetes/ingress.yaml

# Ou avec Helm
helm install microservices-app ./helm/microservices-chart
```

### 5.3. Fonctionnement Technique

1. Le pod frontend contient Nginx pour servir l'application
2. Un Ingress Controller route les requêtes externes vers les services appropriés
3. Les services backend sont exposés via un service K8s
4. Les variables d'environnement sont injectées via ConfigMaps ou Secrets

**Flux de requêtes:**

```
Client → Ingress Controller → Service K8s → Pod
```

### 5.4. Injection des Variables dans Kubernetes

Dans Kubernetes, les variables d'environnement sont fournies via des ConfigMaps ou des Secrets :

```yaml
apiVersion: apps/v1
kind: Deployment
spec:
  template:
    spec:
      containers:
        - name: frontend
          env:
            - name: ENVIRONMENT
              value: "kubernetes"
            - name: USER_SERVICE_URL
              value: "http://api.microservices.local/users"
          # Autres variables...
```

Le même script `docker-entrypoint.sh` traite ces variables de la même façon que dans Docker, assurant la cohérence entre environnements.

## 6. Environnement de Production

### 6.1. Configuration

**URLs des Services:**

- Frontend: `https://app.yourdomain.com`
- User Service: `https://api.yourdomain.com/users`
- Order Service: `https://api.yourdomain.com/orders`

**Méthode d'Exécution:**

- CDN pour les assets statiques
- Service d'API géré ou conteneurs en production
- Load balancing et haute disponibilité

### 6.2. Déploiement

```bash
# Build de production
npm run build

# Déploiement (exemple avec AWS)
aws s3 sync dist/ s3://app.yourdomain.com/
aws cloudfront create-invalidation --distribution-id DIST_ID --paths "/*"
```

### 6.3. Fonctionnement Technique

1. Application frontend compilée et optimisée
2. Assets servis par un CDN
3. Requêtes API envoyées à une API Gateway ou Load Balancer
4. Pas d'indicateur d'environnement affiché aux utilisateurs
5. Logging et monitoring en production

## 7. Sélection d'Environnement

### 7.1. Par Script npm

Les scripts npm permettent de démarrer l'application dans différents environnements :

```json
"scripts": {
  "dev": "vite --mode development",
  "dev:docker": "vite --mode docker",
  "dev:k8s": "vite --mode kubernetes",
  "dev:prod": "vite --mode production"
}
```

### 7.2. Par Variable d'Environnement Docker

```bash
# Démarrer avec un environnement spécifique
FRONTEND_ENV=kubernetes docker-compose -f infrastructure/docker/docker-compose.yml up -d
```

### 7.3. Détection Automatique

Le système détecte automatiquement l'environnement selon la priorité :

1. Variables d'environnement runtime (window.\_\_ENV)
2. Variables d'environnement build (import.meta.env)
3. Valeurs par défaut des fichiers de configuration

## 8. Indicateurs Visuels

### 8.1. EnvironmentIndicator

Un indicateur visuel montre l'environnement actuel (sauf en production) :

- **Vert** : Development
- **Bleu** : Docker
- **Violet** : Kubernetes
- **Aucun** : Production

### 8.2. EnvDebug

Le composant `EnvDebug` peut être activé pour afficher les détails de configuration :

```jsx
<EnvDebug />
```

## 9. Comparaison des Méthodes de Configuration d'Environnement

| Méthode                              | Avantages                          | Inconvénients                         | Utilisation                   |
| ------------------------------------ | ---------------------------------- | ------------------------------------- | ----------------------------- |
| Variables au Runtime (notre méthode) | Flexibilité maximale, image unique | Légère complexité de configuration    | Docker, Kubernetes            |
| Variables au Build                   | Simple à comprendre                | Nécessite une image par environnement | Déploiements simples          |
| Fichiers de config externes          | Flexibilité moyenne                | Complexité de gestion des fichiers    | Architectures traditionnelles |

## 10. Gestion des URLs entre Environnements

### 10.1. Problématique

Les URLs des services diffèrent entre les environnements :

| Environnement | Frontend                | Backend                 |
| ------------- | ----------------------- | ----------------------- |
| Development   | localhost:3000          | localhost:808x          |
| Docker        | docker.frontend.com     | localhost:808x          |
| Kubernetes    | app.microservices.local | api.microservices.local |
| Production    | app.yourdomain.com      | api.yourdomain.com      |

### 10.2. Solution

- **Développement/Docker :** Requêtes API directes ou via proxy Nginx
- **Kubernetes :** API Gateway ou Ingress Controller
- **Production :** CDN + API Gateway

### 10.3. Communication Backend-to-Backend

Les services backend communiquent différemment selon l'environnement :

- **Développement :** localhost:port
- **Docker :** nom-service:port
- **Kubernetes :** nom-service.namespace.svc.cluster.local
- **Production :** URLs internes au réseau cloud

## 11. Troubleshooting

### 11.1. Problèmes d'Environnement

| Problème               | Solution                                                      |
| ---------------------- | ------------------------------------------------------------- |
| CORS errors            | Vérifier les origines autorisées dans les services backend    |
| URLs incorrectes       | Vérifier la configuration dans le bon fichier d'environnement |
| Nginx ne démarre pas   | Vérifier les logs Docker et la syntaxe nginx                  |
| Services indisponibles | Vérifier que les services backend sont démarrés               |

### 11.2. Vérification de Configuration

```bash
# Afficher les variables d'environnement dans Docker
docker exec frontend env

# Vérifier la configuration Nginx
docker exec frontend cat /etc/nginx/conf.d/default.conf

# Vérifier la configuration runtime
docker exec frontend cat /usr/share/nginx/html/config.js
```

### 11.3. Débogage des Variables d'Environnement au Runtime

Pour déboguer des problèmes spécifiques aux variables d'environnement au runtime :

```bash
# Exécuter le conteneur avec des variables explicites
docker run -it --rm \
  -e USER_SERVICE_URL=http://test-api:8081 \
  -e ENVIRONMENT=test \
  your-image:latest /bin/sh

# Vérifier le résultat de la génération du script
cat /usr/share/nginx/html/config.js
```

## 12. Bonnes Pratiques

1. **Ne jamais coder en dur les URLs** dans les composants
2. **Utiliser config.userServiceUrl** au lieu d'URLs hardcodées
3. **Toujours tester dans plusieurs environnements** avant de déployer
4. **Gardez les configurations synchronisées** entre les environnements
5. **Utilisez des placeholders cohérents** dans les templates
6. **Fournissez des valeurs par défaut** pour toutes les variables d'environnement
7. **Documentez les variables requises** pour chaque environnement

## 13. Évolution de l'Architecture

Le système est conçu pour évoluer facilement :

1. Ajout de nouveaux environnements (staging, testing)
2. Prise en charge de nouvelles variables de configuration
3. Support de nouveaux services backend

Pour ajouter un nouvel environnement :

- Créer `environments/newenv.ts`
- Créer `.env.newenv`
- Ajouter un script dans `package.json`
- Mettre à jour le type `Environment` dans `env.ts`

---

Cette documentation complète vous fournit toutes les informations nécessaires pour comprendre, utiliser et maintenir efficacement les différents environnements de votre application, avec une attention particulière à la méthode des "Variables d'Environnement à l'Exécution du Conteneur avec Nginx".
