'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Shield, 
  Copy, 
  Check, 
  Lock,
  Key,
  User,
  Mail,
  Smartphone,
  AlertCircle,
  CheckCircle2,
  Info,
  Code,
  Terminal,
  Globe,
  Clock,
  RefreshCw,
  UserCheck,
  LogIn,
  LogOut,
  Settings
} from 'lucide-react';
import PublicLayout from '@/components/layout/PublicLayout';

export default function APIAuthPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const CodeBlock = ({ code, id, language = 'javascript', title = '' }: { 
    code: string; 
    id: string; 
    language?: string;
    title?: string;
  }) => (
    <div className="relative bg-gray-900 text-gray-100 rounded-lg overflow-hidden">
      {title && (
        <div className="bg-gray-800 px-4 py-2 text-sm text-gray-400 border-b border-gray-700">
          {title}
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
              href="/docs/api"
              className="inline-flex items-center text-blue-100 hover:text-white mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to API Docs
            </Link>
            <div className="flex items-center mb-4">
              <Shield className="h-12 w-12 mr-4" />
              <h1 className="text-4xl font-bold">Authentication API</h1>
            </div>
            <p className="text-xl text-blue-100">
              Secure authentication endpoints with JWT tokens and 2FA support
            </p>
          </div>
        </div>

        <div className="container mx-auto px-6 py-8">
          {/* Navigation Tabs */}
          <div className="bg-white rounded-lg shadow-lg mb-8">
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-6 py-4 font-semibold transition ${
                  activeTab === 'overview'
                    ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('endpoints')}
                className={`px-6 py-4 font-semibold transition ${
                  activeTab === 'endpoints'
                    ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Endpoints
              </button>
              <button
                onClick={() => setActiveTab('jwt')}
                className={`px-6 py-4 font-semibold transition ${
                  activeTab === 'jwt'
                    ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                JWT Tokens
              </button>
              <button
                onClick={() => setActiveTab('2fa')}
                className={`px-6 py-4 font-semibold transition ${
                  activeTab === '2fa'
                    ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                2FA Setup
              </button>
            </div>

            <div className="p-8">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Authentication Overview</h2>
                    <p className="text-gray-600 mb-6">
                      Our API uses JWT (JSON Web Tokens) for authentication with optional 2FA support for enhanced security.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-6 bg-blue-50 rounded-lg">
                      <Key className="h-8 w-8 text-blue-600 mb-3" />
                      <h3 className="font-bold text-lg mb-2">Token-Based Auth</h3>
                      <p className="text-sm text-gray-600">
                        Stateless authentication using JWT tokens with configurable expiration times.
                      </p>
                    </div>
                    
                    <div className="p-6 bg-green-50 rounded-lg">
                      <Shield className="h-8 w-8 text-green-600 mb-3" />
                      <h3 className="font-bold text-lg mb-2">Two-Factor Authentication</h3>
                      <p className="text-sm text-gray-600">
                        Optional TOTP-based 2FA for additional security layer.
                      </p>
                    </div>
                    
                    <div className="p-6 bg-purple-50 rounded-lg">
                      <RefreshCw className="h-8 w-8 text-purple-600 mb-3" />
                      <h3 className="font-bold text-lg mb-2">Token Refresh</h3>
                      <p className="text-sm text-gray-600">
                        Automatic token refresh mechanism for seamless user experience.
                      </p>
                    </div>
                    
                    <div className="p-6 bg-orange-50 rounded-lg">
                      <Clock className="h-8 w-8 text-orange-600 mb-3" />
                      <h3 className="font-bold text-lg mb-2">Session Management</h3>
                      <p className="text-sm text-gray-600">
                        Configurable session duration with secure cookie storage.
                      </p>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 mr-2" />
                      <div>
                        <p className="text-sm text-yellow-800">
                          <strong>Security Note:</strong> Always use HTTPS in production and store tokens securely. 
                          Never expose tokens in URLs or localStorage for sensitive applications.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Endpoints Tab */}
              {activeTab === 'endpoints' && (
                <div className="space-y-8">
                  <h2 className="text-2xl font-bold mb-4">Authentication Endpoints</h2>

                  {/* Login Endpoint */}
                  <div className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <span className="bg-blue-500 text-white px-3 py-1 rounded font-bold text-sm mr-3">POST</span>
                      <code className="text-lg font-mono">/api/auth/login</code>
                    </div>
                    
                    <p className="text-gray-600 mb-4">Authenticate user and receive JWT token.</p>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Request Body:</h4>
                        <CodeBlock
                          code={`{
  "username": "admin",
  "password": "securepassword123",
  "rememberMe": true  // Optional
}`}
                          id="login-request"
                          language="json"
                        />
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Success Response:</h4>
                        <CodeBlock
                          code={`{
  "success": true,
  "data": {
    "user": {
      "id": "clx1234567",
      "username": "admin",
      "email": "admin@example.com",
      "role": "SUPER_ADMIN",
      "name": "Administrator"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 3600,
    "tokenType": "Bearer"
  }
}`}
                          id="login-response"
                          language="json"
                        />
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Error Response:</h4>
                        <CodeBlock
                          code={`{
  "success": false,
  "error": {
    "code": "AUTH_FAILED",
    "message": "Invalid username or password"
  }
}`}
                          id="login-error"
                          language="json"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Register Endpoint */}
                  <div className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <span className="bg-green-500 text-white px-3 py-1 rounded font-bold text-sm mr-3">POST</span>
                      <code className="text-lg font-mono">/api/auth/register</code>
                    </div>
                    
                    <p className="text-gray-600 mb-4">Register new user account.</p>
                    
                    <CodeBlock
                      code={`{
  "username": "newuser",
  "email": "newuser@example.com",
  "password": "SecurePass123!",
  "confirmPassword": "SecurePass123!",
  "fullName": "John Doe",
  "phone": "081234567890"
}`}
                      id="register-request"
                      language="json"
                    />
                  </div>

                  {/* Logout Endpoint */}
                  <div className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <span className="bg-red-500 text-white px-3 py-1 rounded font-bold text-sm mr-3">POST</span>
                      <code className="text-lg font-mono">/api/auth/logout</code>
                      <span className="ml-3 bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-semibold">
                        Auth Required
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-4">Invalidate current session and tokens.</p>
                    
                    <CodeBlock
                      code={`// Request Headers
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIs..."
}

// Response
{
  "success": true,
  "message": "Logged out successfully"
}`}
                      id="logout-example"
                      language="json"
                    />
                  </div>

                  {/* Refresh Token Endpoint */}
                  <div className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <span className="bg-purple-500 text-white px-3 py-1 rounded font-bold text-sm mr-3">POST</span>
                      <code className="text-lg font-mono">/api/auth/refresh</code>
                    </div>
                    
                    <p className="text-gray-600 mb-4">Refresh access token using refresh token.</p>
                    
                    <CodeBlock
                      code={`{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}

// Response
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 3600
  }
}`}
                      id="refresh-example"
                      language="json"
                    />
                  </div>
                </div>
              )}

              {/* JWT Tab */}
              {activeTab === 'jwt' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold mb-4">JWT Token Management</h2>

                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                    <p className="text-sm text-blue-800">
                      JWT tokens are used for stateless authentication. Include the token in the Authorization header for protected endpoints.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-lg mb-3">Token Structure</h3>
                    <CodeBlock
                      code={`// Header
{
  "alg": "HS256",
  "typ": "JWT"
}

// Payload
{
  "sub": "clx1234567",         // User ID
  "username": "admin",
  "role": "SUPER_ADMIN",
  "iat": 1701936000,          // Issued at
  "exp": 1701939600,          // Expires at (1 hour)
  "iss": "pondok-imam-syafii" // Issuer
}

// Signature
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  NEXTAUTH_SECRET
)`}
                      id="jwt-structure"
                      language="json"
                    />
                  </div>

                  <div>
                    <h3 className="font-bold text-lg mb-3">Using Tokens in Requests</h3>
                    <CodeBlock
                      code={`// JavaScript/Axios
const response = await axios.get('/api/protected-endpoint', {
  headers: {
    'Authorization': \`Bearer \${accessToken}\`
  }
});

// Fetch API
const response = await fetch('/api/protected-endpoint', {
  headers: {
    'Authorization': \`Bearer \${accessToken}\`,
    'Content-Type': 'application/json'
  }
});

// cURL
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \\
     https://api.example.com/protected-endpoint`}
                      id="token-usage"
                      language="javascript"
                    />
                  </div>

                  <div>
                    <h3 className="font-bold text-lg mb-3">Token Validation Middleware</h3>
                    <CodeBlock
                      code={`// middleware/auth.ts
import jwt from 'jsonwebtoken';

export async function validateToken(req: Request) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return { error: 'No token provided' };
  }
  
  try {
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!);
    return { user: decoded };
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return { error: 'Token expired' };
    }
    return { error: 'Invalid token' };
  }
}`}
                      id="token-validation"
                      language="typescript"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-semibold mb-2">Token Expiration</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Access Token: 1 hour</li>
                        <li>• Refresh Token: 30 days</li>
                        <li>• Remember Me: 90 days</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 bg-orange-50 rounded-lg">
                      <h4 className="font-semibold mb-2">Security Best Practices</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Store tokens in httpOnly cookies</li>
                        <li>• Use secure flag in production</li>
                        <li>• Implement token rotation</li>
                        <li>• Add request signing for sensitive operations</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* 2FA Tab */}
              {activeTab === '2fa' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold mb-4">Two-Factor Authentication</h2>

                  <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                    <p className="text-sm text-green-800">
                      2FA adds an extra layer of security by requiring a time-based one-time password (TOTP) in addition to the regular password.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-lg mb-3">Enable 2FA</h3>
                    <CodeBlock
                      code={`// POST /api/auth/2fa/enable
// Headers: Authorization: Bearer <token>

// Response
{
  "success": true,
  "data": {
    "secret": "JBSWY3DPEHPK3PXP",
    "qrCode": "data:image/png;base64,iVBORw0KGgo...",
    "backupCodes": [
      "ABC123-DEF456",
      "GHI789-JKL012",
      "MNO345-PQR678",
      // ... 8 backup codes total
    ]
  }
}`}
                      id="enable-2fa"
                      language="json"
                    />
                  </div>

                  <div>
                    <h3 className="font-bold text-lg mb-3">Verify 2FA Setup</h3>
                    <CodeBlock
                      code={`// POST /api/auth/2fa/verify
{
  "token": "123456"  // 6-digit TOTP code
}

// Response
{
  "success": true,
  "message": "2FA enabled successfully"
}`}
                      id="verify-2fa"
                      language="json"
                    />
                  </div>

                  <div>
                    <h3 className="font-bold text-lg mb-3">Login with 2FA</h3>
                    <CodeBlock
                      code={`// POST /api/auth/login
{
  "username": "admin",
  "password": "password123",
  "totpCode": "123456"  // Required if 2FA is enabled
}

// Or use backup code
{
  "username": "admin",
  "password": "password123",
  "backupCode": "ABC123-DEF456"
}`}
                      id="login-2fa"
                      language="json"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-bold mb-3">Supported Authenticator Apps</h4>
                      <ul className="space-y-2">
                        <li className="flex items-center">
                          <Smartphone className="h-4 w-4 mr-2 text-blue-600" />
                          Google Authenticator
                        </li>
                        <li className="flex items-center">
                          <Smartphone className="h-4 w-4 mr-2 text-blue-600" />
                          Microsoft Authenticator
                        </li>
                        <li className="flex items-center">
                          <Smartphone className="h-4 w-4 mr-2 text-blue-600" />
                          Authy
                        </li>
                        <li className="flex items-center">
                          <Smartphone className="h-4 w-4 mr-2 text-blue-600" />
                          1Password
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-bold mb-3">Recovery Options</h4>
                      <ul className="space-y-2">
                        <li className="flex items-center">
                          <Key className="h-4 w-4 mr-2 text-green-600" />
                          8 backup codes (single use)
                        </li>
                        <li className="flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-green-600" />
                          Email recovery (admin only)
                        </li>
                        <li className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-green-600" />
                          Admin can disable 2FA
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Testing Authentication */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">Testing Authentication</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-bold mb-3">Quick Test with cURL</h3>
                <CodeBlock
                  code={`# 1. Login and get token
curl -X POST https://your-domain.com/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"username":"admin","password":"admin123"}'

# 2. Use token in protected endpoint
curl https://your-domain.com/api/users \\
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."`}
                  id="test-curl"
                  language="bash"
                />
              </div>

              <div>
                <h3 className="font-bold mb-3">Test with Postman</h3>
                <ol className="space-y-2 text-sm">
                  <li>1. Import the API collection from <code>/docs/api/postman-collection.json</code></li>
                  <li>2. Set environment variables for base URL and tokens</li>
                  <li>3. Run the authentication flow tests</li>
                  <li>4. Token will be automatically saved for subsequent requests</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Error Codes */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Authentication Error Codes</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left">Code</th>
                    <th className="px-4 py-2 text-left">Message</th>
                    <th className="px-4 py-2 text-left">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="px-4 py-2"><code>AUTH_FAILED</code></td>
                    <td className="px-4 py-2">Authentication failed</td>
                    <td className="px-4 py-2">Invalid username or password</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2"><code>TOKEN_EXPIRED</code></td>
                    <td className="px-4 py-2">Token expired</td>
                    <td className="px-4 py-2">JWT token has expired, refresh required</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2"><code>TOKEN_INVALID</code></td>
                    <td className="px-4 py-2">Invalid token</td>
                    <td className="px-4 py-2">Token is malformed or signature invalid</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2"><code>2FA_REQUIRED</code></td>
                    <td className="px-4 py-2">2FA code required</td>
                    <td className="px-4 py-2">User has 2FA enabled, TOTP code needed</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2"><code>2FA_INVALID</code></td>
                    <td className="px-4 py-2">Invalid 2FA code</td>
                    <td className="px-4 py-2">TOTP code is incorrect or expired</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2"><code>ACCOUNT_LOCKED</code></td>
                    <td className="px-4 py-2">Account locked</td>
                    <td className="px-4 py-2">Too many failed attempts</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2"><code>INSUFFICIENT_PERMISSION</code></td>
                    <td className="px-4 py-2">Insufficient permission</td>
                    <td className="px-4 py-2">User role lacks required permission</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}