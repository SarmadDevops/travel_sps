# Deploy on Debian using Docker

## Prereqs

On Debian (as root or with sudo):

```bash
sudo apt update
sudo apt install -y docker.io docker-compose-plugin
sudo systemctl enable --now docker
# optional: run docker without sudo
sudo usermod -aG docker $USER
```

Log out/in if you added yourself to the `docker` group.

## Run the app

1) Copy this folder to your Debian server, then:

```bash
cd travelportal_deployment
cp .env.example .env
nano .env   # set strong passwords/secrets
```

2) Start containers:

```bash
docker compose up -d --build
```

3) Check logs:

```bash
docker compose logs -f backend
```

The site will be available on:
- `http://YOUR_SERVER_IP/`

## Create the first Super Admin

The backend includes a seed script. Run it once:

```bash
docker compose exec backend node Seeders/superAdminSeed.js
```

Default seeded user:
- email: `superadmin@united.com`
- password: `Admin@123`

**Important:** change this user/password after first login.

## Useful commands

```bash
# restart
docker compose restart

# stop
docker compose down

# stop + remove volumes (this deletes the database)
docker compose down -v
```

## Notes

- Frontend talks to backend via Nginx proxy: `/api/*` -> `backend:5000/api/*`.
- Database is persisted in a Docker volume: `db_data`.
