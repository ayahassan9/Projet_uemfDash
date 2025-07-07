#!/usr/bin/env python3
"""
Script pour optimiser le backend pour de grands volumes de données.
Ce script:
1. Implémente la pagination côté serveur
2. Ajoute la mise en cache des résultats de calculs intensifs
3. Optimise les requêtes et la sérialisation JSON
"""

import os
import json
import time
import functools
import logging
from collections import OrderedDict

# Configuration du logging
logging.basicConfig(level=logging.INFO, 
                   format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Configuration
CACHE_DIR = os.path.join(os.path.dirname(__file__), 'cache')
MAX_CACHE_ENTRIES = 100
CACHE_TTL = 3600  # 1 hour in seconds

class LRUCache:
    """Implementation of a Least Recently Used (LRU) cache with time-based expiration."""
    def __init__(self, capacity, ttl_seconds=3600):
        self.cache = OrderedDict()
        self.capacity = capacity
        self.ttl_seconds = ttl_seconds
    
    def get(self, key):
        if key not in self.cache:
            return None
        
        # Check if entry has expired
        entry, timestamp = self.cache[key]
        if time.time() - timestamp > self.ttl_seconds:
            # Remove expired entry
            self.cache.pop(key)
            return None
        
        # Move the entry to end (most recently used)
        self.cache.move_to_end(key)
        return entry
    
    def put(self, key, value):
        # Update the value if key exists
        if key in self.cache:
            self.cache.pop(key)
        elif len(self.cache) >= self.capacity:
            # Remove the least recently used item
            self.cache.popitem(last=False)
        
        # Add new item with current timestamp
        self.cache[key] = (value, time.time())

# Initialize the cache
statistics_cache = LRUCache(MAX_CACHE_ENTRIES, CACHE_TTL)

def ensure_cache_dir():
    """Ensure the cache directory exists."""
    if not os.path.exists(CACHE_DIR):
        os.makedirs(CACHE_DIR)
        logger.info(f"Created cache directory: {CACHE_DIR}")

def cached_result(func):
    """Decorator to cache function results based on arguments."""
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        # Create a cache key from the function name and arguments
        key_parts = [func.__name__]
        key_parts.extend([str(arg) for arg in args])
        key_parts.extend([f"{k}={v}" for k, v in sorted(kwargs.items())])
        cache_key = "|".join(key_parts)
        
        # Check if result is in memory cache
        cached_value = statistics_cache.get(cache_key)
        if cached_value is not None:
            logger.info(f"Cache hit for {func.__name__}")
            return cached_value
        
        # Check if result is in file cache
        cache_file = os.path.join(CACHE_DIR, f"{hash(cache_key)}.json")
        if os.path.exists(cache_file):
            try:
                with open(cache_file, 'r') as f:
                    data = json.load(f)
                    if time.time() - data.get('timestamp', 0) <= CACHE_TTL:
                        logger.info(f"File cache hit for {func.__name__}")
                        result = data['result']
                        # Update memory cache
                        statistics_cache.put(cache_key, result)
                        return result
            except Exception as e:
                logger.warning(f"Failed to load cache file: {e}")
        
        # Calculate result
        start_time = time.time()
        result = func(*args, **kwargs)
        duration = time.time() - start_time
        
        # Cache the result
        statistics_cache.put(cache_key, result)
        
        # Save to file cache if calculation took significant time
        if duration > 1.0:  # Only cache expensive operations
            ensure_cache_dir()
            try:
                with open(cache_file, 'w') as f:
                    json.dump({
                        'result': result,
                        'timestamp': time.time()
                    }, f)
                logger.info(f"Cached result of {func.__name__} ({duration:.2f}s)")
            except Exception as e:
                logger.warning(f"Failed to write cache file: {e}")
        
        return result
    
    return wrapper

def paginate_results(data, page=1, page_size=100):
    """Paginate a list of results."""
    if not data:
        return {"items": [], "total": 0, "page": 1, "total_pages": 0, "page_size": page_size}
    
    # Ensure positive integers
    page = max(1, int(page))
    page_size = max(1, int(page_size))
    
    total_items = len(data)
    total_pages = (total_items + page_size - 1) // page_size
    
    # Adjust page if it's out of range
    page = min(page, total_pages) if total_pages > 0 else 1
    
    # Calculate start and end indices
    start_idx = (page - 1) * page_size
    end_idx = min(start_idx + page_size, total_items)
    
    return {
        "items": data[start_idx:end_idx],
        "total": total_items,
        "page": page,
        "total_pages": total_pages,
        "page_size": page_size
    }

@cached_result
def compute_expensive_statistics(data, category=None):
    """Example of an expensive computation that can benefit from caching."""
    # Simulate an expensive computation
    time.sleep(2)  # Simulating computation time
    
    # Calculate different statistics based on category
    if category == 'gender':
        # Calculate gender-based statistics
        result = {
            "male_count": sum(1 for item in data if item.get("Gender") == "Male"),
            "female_count": sum(1 for item in data if item.get("Gender") == "Female"),
            # More complex calculations...
        }
    elif category == 'nationality':
        # Calculate nationality-based statistics
        nationalities = {}
        for item in data:
            nat = item.get("Nationality", "Unknown")
            if nat not in nationalities:
                nationalities[nat] = 0
            nationalities[nat] += 1
        result = {"nationalities": nationalities}
    else:
        # Default computation
        result = {"total": len(data)}
    
    return result

def optimize_json_payload(data):
    """Optimize a JSON payload by removing unnecessary fields and limiting precision."""
    if isinstance(data, dict):
        # Remove empty values and optimize nested objects
        return {k: optimize_json_payload(v) for k, v in data.items() 
                if v is not None and v != "" and v != [] and v != {}}
    
    elif isinstance(data, list):
        # Optimize list contents
        return [optimize_json_payload(item) for item in data]
    
    elif isinstance(data, float):
        # Limit precision of floating point numbers
        return round(data, 2)
    
    # Return other types unchanged
    return data

def clear_cache():
    """Clear all cached results."""
    # Clear memory cache
    global statistics_cache
    statistics_cache = LRUCache(MAX_CACHE_ENTRIES, CACHE_TTL)
    
    # Clear file cache
    if os.path.exists(CACHE_DIR):
        for file in os.listdir(CACHE_DIR):
            if file.endswith('.json'):
                try:
                    os.remove(os.path.join(CACHE_DIR, file))
                except Exception as e:
                    logger.warning(f"Failed to remove cache file {file}: {e}")
    
    logger.info("Cache cleared")

# Example of how to use these optimizations in your endpoints
def example_optimized_endpoint(request_data):
    """Example of how an optimized endpoint would work."""
    # Get pagination parameters
    page = request_data.get('page', 1)
    page_size = request_data.get('page_size', 100)
    
    # Fetch data (this would be your actual data source)
    data = [{"id": i, "name": f"Student {i}"} for i in range(1, 10001)]
    
    # Apply pagination
    paginated = paginate_results(data, page, page_size)
    
    # Compute expensive statistics with caching
    category = request_data.get('category')
    stats = compute_expensive_statistics(data, category)
    
    # Combine and optimize the response
    response = {
        "data": paginated,
        "statistics": stats,
        "meta": {
            "timestamp": time.time(),
            "cached": True  # This would be determined by your caching implementation
        }
    }
    
    return optimize_json_payload(response)

# Main function to demonstrate usage
def main():
    """Demo function to show how to use the optimization tools."""
    ensure_cache_dir()
    
    # Example request with pagination
    request1 = {'page': 1, 'page_size': 50, 'category': 'gender'}
    print("First request (uncached)...")
    start = time.time()
    result1 = example_optimized_endpoint(request1)
    print(f"Duration: {time.time() - start:.2f}s")
    
    # Same request should be faster due to caching
    print("\nSecond request (should be cached)...")
    start = time.time()
    result2 = example_optimized_endpoint(request1)
    print(f"Duration: {time.time() - start:.2f}s")
    
    # Different request parameters
    request2 = {'page': 2, 'page_size': 50, 'category': 'gender'}
    print("\nThird request (different page, cached computation)...")
    start = time.time()
    result3 = example_optimized_endpoint(request2)
    print(f"Duration: {time.time() - start:.2f}s")
    
    # Clear cache
    print("\nClearing cache...")
    clear_cache()
    
    # After cache clear, should be slow again
    print("\nFourth request (after cache clear)...")
    start = time.time()
    result4 = example_optimized_endpoint(request1)
    print(f"Duration: {time.time() - start:.2f}s")

if __name__ == "__main__":
    main()
