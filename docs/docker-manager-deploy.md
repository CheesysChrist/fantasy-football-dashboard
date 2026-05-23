# Docker deployment for VPS managers

This repository can now run as a Docker-managed stack with two containers:

- `frontend` — Angular production build served by nginx
- `api` — NestJS backend on port `3000`

The frontend proxies browser requests from `/api/*` to the internal `api` service, so the browser never needs to call `localhost:3000` directly.

## Files added

- `Dockerfile.frontend`
- `Dockerfile.api`
- `docker-compose.yml`
- `docker/nginx.frontend.conf`
- `.dockerignore`

## Recommended VPS manager usage

This stack is designed to work well in managers like:
- Portainer
- Dockge
- Coolify
- Dokploy

If the manager supports Compose stacks, point it at `docker-compose.yml`.

## Default ports

- public app URL: host port `8080` -> container `frontend:80`
- internal API URL: `http://api:3000`

If your manager provides its own edge proxy / domain routing, you can remove the host port mapping and let the manager publish the `frontend` service instead.

## Local Docker usage

```bash
docker compose up --build
```

Then open:

```text
http://localhost:8080
```

## Portainer / Dockge flow

1. Create a new stack.
2. Paste in `docker-compose.yml` or deploy from the Git repo.
3. Build and start the stack.
4. Publish port `8080` on the VPS.
5. Optionally place your host/domain reverse proxy in front of that port.

## Coolify / Dokploy flow

You have two workable approaches:

### Option A — compose-based app
- import the repository as a compose application
- use `docker-compose.yml`
- expose the `frontend` service through the platform domain/router

### Option B — split services
- create one service from `Dockerfile.frontend`
- create one service from `Dockerfile.api`
- ensure both share the same internal network
- route frontend `/api` traffic to the API service name `api`

For most managers, **compose mode is the simplest**.

## Important app behavior

The frontend API base is now:

```ts
/api
```

That means:
- local browser-to-api traffic works through nginx in Docker
- same-origin deployment is simpler
- you avoid hardcoding `http://localhost:3000` in production

## Operational notes

- `frontend` depends on `api`, but `depends_on` only controls startup order, not health.
- The UI already has preview-data fallbacks for some failed API calls.
- The API currently makes outbound requests to Sleeper, so the container needs normal internet egress.
- Shared `@ux-lib-csr/*` dependencies still come from vendored tarballs in `vendor/ux-lib-csr/`.

## Suggested next hardening steps

If you want this to become a durable VPS deployment, next improvements should be:

1. add Docker healthchecks
2. add a domain/HTTPS reverse proxy in the VPS manager
3. add persistent logging / log shipping if needed
4. optionally move port binding from `8080` to manager-native ingress
5. optionally parameterize the frontend API path further only if multi-origin hosting becomes necessary
