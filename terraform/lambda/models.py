def create_shortlink_item(short_code, original_url, expiry_time, user_id=None, password_hash=None):
    import time
    return {
        'short_code': short_code,
        'original_url': original_url,
        'created_at': int(time.time()),
        'expiry_time': expiry_time,
        'clicks': 0,
        'user_id': user_id,
        'password_hash': password_hash
    }
