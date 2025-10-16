'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Package, 
  Copy, 
  Check, 
  Terminal,
  Server,
  Database,
  Globe,
  Shield,
  GitBranch,
  AlertCircle,
  CheckCircle2,
  Info,
  Layers,
  Play,
  RefreshCw,
  Download,
  Zap,
  HardDrive,
  Cloud,
  Settings,
  FileText,
  Box,
  Container
} from 'lucide-react';
import PublicLayout from '@/components/layout/PublicLayout';

export default function DockerDeploymentPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('docker-compose');

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const CodeBlock = ({ code, id, language = 'bash', filename = '' }: { 
    code: string; 
    id: string; 
    language?: string;
    filename?: string;
  }) => (
    <div className="relative bg-gray-900 text-gray-100 rounded-lg overflow-hidden">
      {filename && (
        <div className="bg-gray-800 px-4 py-2 text-sm font-mono text-gray-400 border-b border-gray-700">
          {filename}
        </div>
      )}
      <div className="relative p-4 overflow-x-auto">
        <button
          onClick={() => handleCopy(code, id)}
          className="absolute top-2 right-2 p-2 bg-gray-800 rounded hover:bg-gray-700 transition opacity-0 hover:opacity-100"
        >
          {copiedId === id ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
        </button>
        <pre className="text-sm font-mono">
          <code className={`language-${language}`}>{code}</code>
        </pre>
      </div>
    </div>
  );

  return (
    <PublicLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12">
          <div className="container mx-auto px-6">
            <Link
              href="/docs"
              className="inline-flex items-center text-blue-100 hover:text-white mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Docs
            </Link>
            <div className="flex items-center mb-4">
              <Package className="h-12 w-12 mr-4" />
              <h1 className="text-4xl font-bold">Docker Deployment</h1>
            </div>
            <p className="text-xl text-blue-100">
              Deploy Pondok Imam Syafi\'i using Docker containers for consistent environments
            </p>
          </div>
        </div>

        <div className="container mx-auto px-6 py-8">
          {/* Why Docker */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Container className="h-8 w-8 text-blue-600 mr-3" />
              Why Use Docker?
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-4 bg-blue-50 rounded-lg">
                <Layers className="h-8 w-8 text-blue-600 mb-3" />
                <h3 className="font-bold mb-2">Consistency</h3>
                <p className="text-sm text-gray-600">
                  Same environment across development, staging, and production
                </p>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <Zap className="h-8 w-8 text-green-600 mb-3" />
                <h3 className="font-bold mb-2">Scalability</h3>
                <p className="text-sm text-gray-600">
                  Easy horizontal scaling with container orchestration
                </p>
              </div>
              
              <div className="p-4 bg-purple-50 rounded-lg">
                <Shield className="h-8 w-8 text-purple-600 mb-3" />
                <h3 className="font-bold mb-2">Isolation</h3>
                <p className="text-sm text-gray-600">
                  Applications run in isolated containers for better security
                </p>
              </div>
            </div>
          </div>

          {/* Prerequisites */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">Prerequisites</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-semibold">Docker Desktop</h3>
                  <p className="text-sm text-gray-600">Docker Engine and Docker Compose</p>
                </div>
                <a 
                  href="https://www.docker.com/products/docker-desktop" 
                  target="_blank"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Download
                </a>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-semibold">Git</h3>
                  <p className="text-sm text-gray-600">For cloning the repository</p>
                </div>
                <a 
                  href="https://git-scm.com/downloads" 
                  target="_blank"
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
                >
                  Download
                </a>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="font-semibold mb-3">Verify Installation:</h3>
              <CodeBlock
                code={`# Check Docker version
docker --version
# Docker version 24.0.0, build abcdef

# Check Docker Compose version  
docker-compose --version
# Docker Compose version v2.20.0`}
                id="verify-docker"
              />
            </div>
          </div>

          {/* Deployment Methods */}
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow-lg">
              <div className="flex border-b">
                <button
                  onClick={() => setActiveTab('docker-compose')}
                  className={`flex-1 px-6 py-4 text-center font-semibold transition ${
                    activeTab === 'docker-compose'
                      ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Docker Compose (Recommended)
                </button>
                <button
                  onClick={() => setActiveTab('dockerfile')}
                  className={`flex-1 px-6 py-4 text-center font-semibold transition ${
                    activeTab === 'dockerfile'
                      ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Manual Docker Build
                </button>
                <button
                  onClick={() => setActiveTab('kubernetes')}
                  className={`flex-1 px-6 py-4 text-center font-semibold transition ${
                    activeTab === 'kubernetes'
                      ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Kubernetes
                </button>
              </div>

              <div className="p-8">
                {/* Docker Compose Method */}
                {activeTab === 'docker-compose' && (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-2xl font-bold mb-4">Deploy with Docker Compose</h3>
                      <p className="text-gray-600 mb-6">
                        The easiest way to deploy the complete stack with all services.
                      </p>
                    </div>

                    {/* Step 1 */}
                    <div>
                      <h4 className="font-bold text-lg mb-3">Step 1: Clone Repository</h4>
                      <CodeBlock
                        code={`git clone https://github.com/pendtiumpraz/pesantren-coconut.git
cd pesantren-coconut`}
                        id="clone-repo-docker"
                      />
                    </div>

                    {/* Step 2 */}
                    <div>
                      <h4 className="font-bold text-lg mb-3">Step 2: Create Docker Compose File</h4>
                      <CodeBlock
                        code={`version: '3.8'

services:
  app:
    build: 
      context: .
      dockerfile: Dockerfile
    container_name: pondok-app
    restart: unless-stopped
    ports:
      - "3030:3030"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:password@db:5432/imam_syafii_db
      - NEXTAUTH_URL=http://localhost:3030
      - NEXTAUTH_SECRET=your-secret-key-minimum-32-characters
    depends_on:
      - db
      - redis
    volumes:
      - uploads:/app/public/uploads
      - ./logs:/app/logs
    networks:
      - pondok-network

  db:
    image: postgres:15-alpine
    container_name: pondok-db
    restart: unless-stopped
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=imam_syafii_db
    volumes:
      - postgres-data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    networks:
      - pondok-network

  redis:
    image: redis:7-alpine
    container_name: pondok-redis
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    networks:
      - pondok-network

  nginx:
    image: nginx:alpine
    container_name: pondok-nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
      - uploads:/usr/share/nginx/html/uploads:ro
    depends_on:
      - app
    networks:
      - pondok-network

volumes:
  postgres-data:
  redis-data:
  uploads:

networks:
  pondok-network:
    driver: bridge`}
                        id="docker-compose-yml"
                        language="yaml"
                        filename="docker-compose.yml"
                      />
                    </div>

                    {/* Step 3 */}
                    <div>
                      <h4 className="font-bold text-lg mb-3">Step 3: Create Dockerfile</h4>
                      <CodeBlock
                        code={`# Multi-stage build for smaller image size
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build application
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \\
    adduser -S nextjs -u 1001

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package*.json ./
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3030

# Start application with dumb-init
ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "start"]`}
                        id="dockerfile"
                        language="dockerfile"
                        filename="Dockerfile"
                      />
                    </div>

                    {/* Step 4 */}
                    <div>
                      <h4 className="font-bold text-lg mb-3">Step 4: Create Nginx Configuration</h4>
                      <CodeBlock
                        code={`events {
    worker_connections 1024;
}

http {
    upstream app {
        server app:3030;
    }

    server {
        listen 80;
        server_name localhost;

        client_max_body_size 10M;

        # Gzip compression
        gzip on;
        gzip_vary on;
        gzip_min_length 1024;
        gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss;

        location / {
            proxy_pass http://app;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        location /uploads {
            alias /usr/share/nginx/html/uploads;
            expires 30d;
            add_header Cache-Control "public, immutable";
        }
    }
}`}
                        id="nginx-conf"
                        language="nginx"
                        filename="nginx.conf"
                      />
                    </div>

                    {/* Step 5 */}
                    <div>
                      <h4 className="font-bold text-lg mb-3">Step 5: Environment Configuration</h4>
                      <CodeBlock
                        code={`# Copy environment template
cp .env.example .env

# Edit environment variables
nano .env`}
                        id="env-setup-docker"
                      />
                      
                      <p className="text-gray-600 mt-4 mb-2">Essential environment variables:</p>
                      <CodeBlock
                        code={`# Database (handled by Docker Compose)
DATABASE_URL="postgresql://postgres:password@db:5432/imam_syafii_db"

# NextAuth
NEXTAUTH_URL="http://localhost:3030"
NEXTAUTH_SECRET="generate-32-character-secret-here"

# Redis (for caching)
REDIS_URL="redis://redis:6379"

# Email Service (optional)
EMAIL_FROM="noreply@yourdomain.com"
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASSWORD="your-app-password"`}
                        id="env-vars-docker"
                        language="env"
                        filename=".env"
                      />
                    </div>

                    {/* Step 6 */}
                    <div>
                      <h4 className="font-bold text-lg mb-3">Step 6: Build and Run</h4>
                      <CodeBlock
                        code={`# Build all services
docker-compose build

# Start all services in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Check service status
docker-compose ps`}
                        id="docker-run"
                      />
                      
                      <div className="mt-4 p-4 bg-green-50 rounded-lg">
                        <div className="flex items-start">
                          <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 mr-2" />
                          <div>
                            <p className="text-sm text-green-800">
                              <strong>Success!</strong> Application is now running at:
                            </p>
                            <ul className="mt-2 space-y-1 text-sm text-green-700">
                              <li>• Application: <code className="bg-green-100 px-1">http://localhost</code></li>
                              <li>• Database: <code className="bg-green-100 px-1">localhost:5432</code></li>
                              <li>• Redis: <code className="bg-green-100 px-1">localhost:6379</code></li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Step 7 */}
                    <div>
                      <h4 className="font-bold text-lg mb-3">Step 7: Initialize Database</h4>
                      <CodeBlock
                        code={`# Run database migrations
docker-compose exec app npx prisma migrate deploy

# Seed database (optional)
docker-compose exec app npx prisma db seed`}
                        id="init-db-docker"
                      />
                    </div>
                  </div>
                )}

                {/* Manual Docker Build */}
                {activeTab === 'dockerfile' && (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-2xl font-bold mb-4">Manual Docker Build</h3>
                      <p className="text-gray-600 mb-6">
                        Build and run containers manually without Docker Compose.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-bold text-lg mb-3">Create Network</h4>
                      <CodeBlock
                        code="docker network create pondok-network"
                        id="create-network"
                      />
                    </div>

                    <div>
                      <h4 className="font-bold text-lg mb-3">Run PostgreSQL</h4>
                      <CodeBlock
                        code={`docker run -d \\
  --name pondok-db \\
  --network pondok-network \\
  -e POSTGRES_USER=postgres \\
  -e POSTGRES_PASSWORD=password \\
  -e POSTGRES_DB=imam_syafii_db \\
  -v postgres-data:/var/lib/postgresql/data \\
  -p 5432:5432 \\
  postgres:15-alpine`}
                        id="run-postgres"
                      />
                    </div>

                    <div>
                      <h4 className="font-bold text-lg mb-3">Run Redis</h4>
                      <CodeBlock
                        code={`docker run -d \\
  --name pondok-redis \\
  --network pondok-network \\
  -v redis-data:/data \\
  -p 6379:6379 \\
  redis:7-alpine`}
                        id="run-redis"
                      />
                    </div>

                    <div>
                      <h4 className="font-bold text-lg mb-3">Build Application Image</h4>
                      <CodeBlock
                        code={`# Build the image
docker build -t pondok-app .

# Run the application
docker run -d \\
  --name pondok-app \\
  --network pondok-network \\
  -p 3030:3030 \\
  -e DATABASE_URL="postgresql://postgres:password@pondok-db:5432/imam_syafii_db" \\
  -e NEXTAUTH_URL="http://localhost:3030" \\
  -e NEXTAUTH_SECRET="your-secret-key" \\
  -v uploads:/app/public/uploads \\
  pondok-app`}
                        id="build-app"
                      />
                    </div>
                  </div>
                )}

                {/* Kubernetes Deployment */}
                {activeTab === 'kubernetes' && (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-2xl font-bold mb-4">Kubernetes Deployment</h3>
                      <p className="text-gray-600 mb-6">
                        Deploy to Kubernetes for production-grade container orchestration.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-bold text-lg mb-3">Deployment Configuration</h4>
                      <CodeBlock
                        code={`apiVersion: apps/v1
kind: Deployment
metadata:
  name: pondok-app
  labels:
    app: pondok
spec:
  replicas: 3
  selector:
    matchLabels:
      app: pondok
  template:
    metadata:
      labels:
        app: pondok
    spec:
      containers:
      - name: app
        image: your-registry/pondok-app:latest
        ports:
        - containerPort: 3030
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: pondok-secrets
              key: database-url
        - name: NEXTAUTH_SECRET
          valueFrom:
            secretKeyRef:
              name: pondok-secrets
              key: nextauth-secret
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
---
apiVersion: v1
kind: Service
metadata:
  name: pondok-service
spec:
  selector:
    app: pondok
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3030
  type: LoadBalancer`}
                        id="k8s-deployment"
                        language="yaml"
                        filename="k8s-deployment.yaml"
                      />
                    </div>

                    <div>
                      <h4 className="font-bold text-lg mb-3">Deploy to Kubernetes</h4>
                      <CodeBlock
                        code={`# Create namespace
kubectl create namespace pondok

# Create secrets
kubectl create secret generic pondok-secrets \\
  --from-literal=database-url='postgresql://...' \\
  --from-literal=nextauth-secret='...' \\
  -n pondok

# Apply deployment
kubectl apply -f k8s-deployment.yaml -n pondok

# Check deployment status
kubectl get pods -n pondok

# Get service URL
kubectl get service pondok-service -n pondok`}
                        id="k8s-deploy"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Docker Commands Reference */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Terminal className="h-8 w-8 text-gray-600 mr-3" />
              Useful Docker Commands
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold mb-3">Container Management</h3>
                <CodeBlock
                  code={`# List running containers
docker ps

# List all containers
docker ps -a

# Stop container
docker stop container-name

# Remove container
docker rm container-name

# View container logs
docker logs container-name

# Execute command in container
docker exec -it container-name sh

# Copy files from container
docker cp container:/path/file ./local/path`}
                  id="container-commands"
                />
              </div>

              <div>
                <h3 className="font-bold mb-3">Docker Compose</h3>
                <CodeBlock
                  code={`# Start services
docker-compose up -d

# Stop services
docker-compose down

# Restart services
docker-compose restart

# View logs
docker-compose logs -f service-name

# Execute command
docker-compose exec service-name command

# Rebuild services
docker-compose build --no-cache

# Remove volumes
docker-compose down -v`}
                  id="compose-commands"
                />
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-bold mb-3">Cleanup Commands</h3>
              <CodeBlock
                code={`# Remove unused images
docker image prune -a

# Remove unused volumes
docker volume prune

# Remove everything unused
docker system prune -a --volumes

# Check disk usage
docker system df`}
                id="cleanup-commands"
              />
            </div>
          </div>

          {/* Production Considerations */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Shield className="h-8 w-8 text-green-600 mr-3" />
              Production Best Practices
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold mb-3">Security</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-green-600 mt-0.5 mr-2" />
                    <span>Use specific version tags, not 'latest'</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-green-600 mt-0.5 mr-2" />
                    <span>Run containers as non-root user</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-green-600 mt-0.5 mr-2" />
                    <span>Use secrets management for sensitive data</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-green-600 mt-0.5 mr-2" />
                    <span>Scan images for vulnerabilities</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-green-600 mt-0.5 mr-2" />
                    <span>Use read-only filesystems where possible</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold mb-3">Performance</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <Zap className="h-4 w-4 text-yellow-600 mt-0.5 mr-2" />
                    <span>Use multi-stage builds for smaller images</span>
                  </li>
                  <li className="flex items-start">
                    <Zap className="h-4 w-4 text-yellow-600 mt-0.5 mr-2" />
                    <span>Cache dependencies in Docker layers</span>
                  </li>
                  <li className="flex items-start">
                    <Zap className="h-4 w-4 text-yellow-600 mt-0.5 mr-2" />
                    <span>Set resource limits for containers</span>
                  </li>
                  <li className="flex items-start">
                    <Zap className="h-4 w-4 text-yellow-600 mt-0.5 mr-2" />
                    <span>Use health checks for container monitoring</span>
                  </li>
                  <li className="flex items-start">
                    <Zap className="h-4 w-4 text-yellow-600 mt-0.5 mr-2" />
                    <span>Enable BuildKit for faster builds</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-bold mb-3">Health Check Configuration</h3>
              <CodeBlock
                code={`# Add to Dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\
  CMD node healthcheck.js || exit 1

# Or in docker-compose.yml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3030/api/health"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s`}
                id="healthcheck"
                language="dockerfile"
              />
            </div>
          </div>

          {/* Troubleshooting */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <AlertCircle className="h-8 w-8 text-orange-600 mr-3" />
              Common Issues & Solutions
            </h2>

            <div className="space-y-6">
              <div className="border-l-4 border-orange-400 pl-4">
                <h3 className="font-semibold mb-2">Container exits immediately</h3>
                <p className="text-sm text-gray-600 mb-2">Check logs and ensure proper CMD/ENTRYPOINT:</p>
                <CodeBlock
                  code={`# Check exit reason
docker logs container-name

# Run interactively to debug
docker run -it --entrypoint sh image-name`}
                  id="fix-exit"
                />
              </div>

              <div className="border-l-4 border-orange-400 pl-4">
                <h3 className="font-semibold mb-2">Cannot connect to database</h3>
                <p className="text-sm text-gray-600 mb-2">Ensure services are on same network:</p>
                <CodeBlock
                  code={`# Check network
docker network ls
docker network inspect pondok-network

# Test connection
docker exec app-container ping db-container`}
                  id="fix-network"
                />
              </div>

              <div className="border-l-4 border-orange-400 pl-4">
                <h3 className="font-semibold mb-2">Permission denied errors</h3>
                <p className="text-sm text-gray-600 mb-2">Fix file permissions:</p>
                <CodeBlock
                  code={`# In Dockerfile
RUN chown -R node:node /app
USER node

# Or fix volumes
docker exec -u root container-name chown -R 1000:1000 /app/uploads`}
                  id="fix-permissions"
                />
              </div>
            </div>
          </div>

          {/* Docker Hub Deployment */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Cloud className="h-8 w-8 text-blue-600 mr-3" />
              Push to Docker Hub
            </h2>

            <div className="space-y-4">
              <p className="text-gray-700">
                Share your Docker image through Docker Hub for easy deployment:
              </p>

              <CodeBlock
                code={`# Login to Docker Hub
docker login

# Tag your image
docker tag pondok-app:latest yourusername/pondok-app:latest

# Push to Docker Hub
docker push yourusername/pondok-app:latest

# Pull on another server
docker pull yourusername/pondok-app:latest`}
                id="docker-hub"
              />

              <div className="p-4 bg-white rounded-lg">
                <h4 className="font-semibold mb-2">Automated Builds with GitHub Actions:</h4>
                <CodeBlock
                  code={`name: Docker Build and Push

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Login to Docker Hub
        uses: docker/login-action@v1
        with:
          username: \${{ secrets.DOCKER_USERNAME }}
          password: \${{ secrets.DOCKER_TOKEN }}
      
      - name: Build and push
        uses: docker/build-push-action@v2
        with:
          push: true
          tags: yourusername/pondok-app:latest`}
                  id="github-action"
                  language="yaml"
                  filename=".github/workflows/docker.yml"
                />
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-8 rounded-lg">
            <h3 className="font-bold text-2xl mb-4">Docker Deployment Complete! 🐳</h3>
            <p className="text-gray-700 mb-6">
              Your application is now containerized and ready for deployment anywhere.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <Link href="/docs/monitoring" className="bg-white p-4 rounded-lg hover:shadow-lg transition">
                <h4 className="font-semibold mb-2">📊 Container Monitoring</h4>
                <p className="text-sm text-gray-600">Monitor Docker containers</p>
              </Link>
              <Link href="/docs/scaling" className="bg-white p-4 rounded-lg hover:shadow-lg transition">
                <h4 className="font-semibold mb-2">⚡ Scale with Swarm</h4>
                <p className="text-sm text-gray-600">Docker Swarm orchestration</p>
              </Link>
              <Link href="/docs/ci-cd" className="bg-white p-4 rounded-lg hover:shadow-lg transition">
                <h4 className="font-semibold mb-2">🔄 CI/CD Pipeline</h4>
                <p className="text-sm text-gray-600">Automate deployments</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}