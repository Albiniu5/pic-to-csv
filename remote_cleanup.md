# Remote Server Cleanup Commands

## 1. SSH into your server
```bash
ssh root@77.42.91.174
```

## 2. Check disk space
```bash
df -h
```

## 3. Clean up Docker (run these one by one)
```bash
# Remove unused containers
docker container prune -f

# Remove unused images (THIS WILL FREE THE MOST SPACE)
docker image prune -a -f

# Remove unused volumes
docker volume prune -f

# Remove build cache
docker builder prune -f
```

## 4. Check space freed
```bash
df -h
```

## 5. Restart Coolify
```bash
docker restart coolify
```

## 6. Access Coolify
Open: http://77.42.91.174:8000/login

## Quick All-in-One Cleanup
```bash
ssh root@77.42.91.174 "docker system prune -a --volumes -f && df -h && docker restart coolify"
```
