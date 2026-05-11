# Deployment Guide

## Production Deployment

This guide covers deploying MYND Knowledge Paleontology in a production environment.

## Prerequisites

### Hardware Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| CPU | 4 cores | 8+ cores |
| RAM | 16 GB | 32+ GB |
| Storage | 100 GB SSD | 500+ GB NVMe SSD |
| Network | 1 Gbps | 10 Gbps |

### Software Requirements

- Docker 24.0+
- Docker Compose 2.20+
- Linux kernel 5.4+ (recommended: Ubuntu 22.04 LTS)
- Domain name with DNS configured
- SSL certificate (Let's Encrypt recommended)

## Quick Production Deploy

### 1. Prepare Environment

```bash
# Clone repository
git clone https://github.com/myndlabs/knowledge-paleontology.git
cd knowledge-paleontology

# Create environment file
cp .env.example .env
```

### 2. Configure Environment Variables

Edit `.env` with production values:

```env
# Security
JWT_SECRET=your-strong-jwt-secret-here
JWT_REFRESH_SECRET=your-strong-refresh-secret-here

# Database
DATABASE_URL=postgresql://mynd:strong-password@postgres:5432/mynd
TIMESCALEDB_URL=postgresql://mynd:strong-password@timescaledb:5432/mynd_ts

# Redis
REDIS_URL=redis://redis:6379

# CORS
CORS_ORIGINS=https://your-domain.com

# Stripe (optional)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 3. Generate Strong Secrets

```bash
# Generate secure random secrets
openssl rand -hex 32
```

### 4. Start Production Stack

```bash
# Start all services in detached mode
docker-compose up -d

# Verify all services are running
docker-compose ps

# Check logs
docker-compose logs -f
```

### 5. Run Database Migrations

```bash
# Run initial schema migration
docker-compose exec postgres psql -U mynd -d mynd -f /docker-entrypoint-initdb.d/001_initial_schema.sql
```

## SSL/TLS Configuration

### Option 1: Let's Encrypt with Certbot

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal setup
sudo certbot renew --dry-run
```

### Option 2: Bring Your Own Certificate

Place certificates in `nginx/ssl/`:
```
nginx/ssl/
├── fullchain.pem
└── privkey.pem
```

Update `nginx/nginx.conf` to enable HTTPS:
```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;
    
    # ... rest of configuration
}
```

## Database Backup Strategy

### Automated Backups

Add to `docker-compose.yml`:
```yaml
backup:
  image: postgres:16-alpine
  volumes:
    - ./backups:/backups
  command: >
    sh -c 'while true; do
      pg_dump -h postgres -U mynd -d mynd -f /backups/backup-$(date +%Y%m%d_%H%M%S).sql;
      find /backups -name "*.sql" -mtime +7 -delete;
      sleep 86400;
    done'
```

### Manual Backup

```bash
# Create backup
docker-compose exec postgres pg_dump -U mynd -d mynd > backup_$(date +%Y%m%d).sql

# Restore from backup
docker-compose exec -T postgres psql -U mynd -d mynd < backup_file.sql
```

## Monitoring & Observability

### Health Checks

All services include built-in health checks:

```bash
# Check individual service health
curl http://localhost/health
curl http://localhost:8000/health
curl http://localhost:8001/health
```

### Log Aggregation

Add Prometheus + Grafana for monitoring:

```bash
# Add monitoring stack (optional)
docker-compose -f docker-compose.monitoring.yml up -d
```

Key metrics to monitor:
- API response times
- Database query latency
- Vector search performance
- Memory/CPU usage
- Disk space utilization

## Scaling

### Horizontal Scaling

```yaml
# docker-compose.override.yml
services:
  backend:
    deploy:
      replicas: 3
  
  python-worker:
    deploy:
      replicas: 4
```

### Database Scaling

- **PostgreSQL**: Add read replicas for query-heavy workloads
- **Redis**: Enable clustering for high availability
- **TimescaleDB**: Configure continuous aggregates for time-series data
- **ChromaDB**: Deploy in distributed mode for large datasets

## Security Hardening

### 1. Network Security

```bash
# Configure UFW firewall
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### 2. Container Security

- Run containers as non-root users (configured by default)
- Enable read-only filesystem where possible
- Limit container capabilities
- Use official base images only

### 3. Secrets Management

Never commit secrets to version control:
- Use environment variables
- Consider HashiCorp Vault for production
- Rotate secrets quarterly

### 4. API Security

- Enable rate limiting (configured by default)
- Use WAF for production
- Implement IP whitelisting for admin endpoints

## High Availability

### Multi-Node Deployment

For enterprise HA deployment:

1. Deploy database cluster with streaming replication
2. Use Redis Sentinel for caching layer HA
3. Deploy application servers behind load balancer
4. Configure automated failover
5. Set up cross-region disaster recovery

## Upgrading

### Zero-Downtime Upgrade

```bash
# Pull latest images
docker-compose pull

# Rolling restart
docker-compose up -d --no-deps backend
docker-compose up -d --no-deps frontend
docker-compose up -d --no-deps python-worker

# Verify health
docker-compose ps
```

### Database Migration

Always backup before migrations:
```bash
# Backup first
docker-compose exec postgres pg_dump -U mynd -d mynd > pre_migration_backup.sql

# Run migrations
# (migration tooling depends on your setup)
```

## Troubleshooting

### Common Issues

#### Services won't start
```bash
# Check specific service logs
docker-compose logs postgres
docker-compose logs backend
```

#### Database connection errors
```bash
# Verify postgres is healthy
docker-compose exec postgres pg_isready -U mynd

# Check environment variables
docker-compose exec backend env | grep DATABASE
```

#### Redis connection errors
```bash
# Test redis connectivity
docker-compose exec redis redis-cli ping
```

#### Frontend can't reach API
```bash
# Verify nginx configuration
docker-compose exec nginx nginx -t

# Check CORS settings
grep CORS_ORIGINS .env
```

### Support Channels

- GitHub Issues: Bug reports and feature requests
- Documentation: [docs/](docs/)
- Enterprise Support: contact@myndlabs.tech

## Next Steps

1. ✅ Deploy core infrastructure
2. 📋 Configure SSO/OAuth integration
3. 📋 Set up monitoring and alerting
4. 📋 Configure automated backups
5. 📋 Run security audit
6. 📋 Load test before production traffic
