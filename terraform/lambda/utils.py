import random
import string
import hashlib

def generate_short_code(length=6):
    characters = string.ascii_letters + string.digits
    return ''.join(random.choices(characters, k=length))

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()