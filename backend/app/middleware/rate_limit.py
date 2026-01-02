from fastapi import Request
from fastapi.responses import JSONResponse
from collections import defaultdict
from typing import Dict, Tuple
import time

class RateLimiter:
    def __init__(self, requests: int = 1000, window: int = 60):
        self.requests = requests
        self.window = window
        self.clients: Dict[str, list] = defaultdict(list)
    
    def is_allowed(self, client_id: str) -> Tuple[bool, int]:
        """Check if request is allowed and return remaining requests"""
        now = time.time()
        
        # Clean old entries
        self.clients[client_id] = [
            timestamp for timestamp in self.clients[client_id]
            if now - timestamp < self.window
        ]
        
        # Check limit
        if len(self.clients[client_id]) >= self.requests:
            return False, 0
        
        # Add current request
        self.clients[client_id].append(now)
        remaining = self.requests - len(self.clients[client_id])
        
        return True, remaining

# Global rate limiter instance - More lenient for development
rate_limiter = RateLimiter(requests=1000, window=60)

async def rate_limit_middleware(request: Request, call_next):
    """Rate limiting middleware"""
    # Skip rate limiting for health checks
    if request.url.path == "/health":
        return await call_next(request)
    
    # Get client identifier
    client_id = request.client.host
    if "x-forwarded-for" in request.headers:
        client_id = request.headers["x-forwarded-for"].split(",")[0].strip()
    
    # Check rate limit
    allowed, remaining = rate_limiter.is_allowed(client_id)
    
    if not allowed:
        return JSONResponse(
            status_code=429,
            content={
                "detail": "Rate limit exceeded. Please try again later.",
                "retry_after": rate_limiter.window
            },
            headers={"Retry-After": str(rate_limiter.window)}
        )
    
    # Add rate limit headers
    response = await call_next(request)
    response.headers["X-RateLimit-Limit"] = str(rate_limiter.requests)
    response.headers["X-RateLimit-Remaining"] = str(remaining)
    response.headers["X-RateLimit-Reset"] = str(int(time.time()) + rate_limiter.window)
    
    return response

