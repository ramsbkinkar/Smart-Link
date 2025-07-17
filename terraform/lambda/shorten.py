import json
import boto3
import time
import logging
from utils import generate_short_code, hash_password
from models import create_shortlink_item

# Setup logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# DynamoDB table
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('ShortLinks')

# CORS headers
CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Methods": "OPTIONS,POST"
}

def lambda_handler(event, context):
    logger.info("Received event: %s", json.dumps(event))

    # Handle CORS preflight
    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': CORS_HEADERS,
            'body': json.dumps({'message': 'CORS preflight passed'})
        }

    try:
        body = json.loads(event.get('body', '{}'))
        original_url = body.get('url')
        password = body.get('password')  # optional

        if not original_url:
            return {
                'statusCode': 400,
                'headers': CORS_HEADERS,
                'body': json.dumps({'error': 'URL is required'})
            }

        short_code = generate_short_code()
        current_time = int(time.time())
        expiry_time = current_time + 7 * 24 * 60 * 60  # 7 days

        password_hash = hash_password(password) if password else None

        item = create_shortlink_item(
            short_code=short_code,
            original_url=original_url,
            expiry_time=expiry_time,
            user_id=None,
            password_hash=password_hash
        )

        table.put_item(Item=item)

        return {
            'statusCode': 200,
            'headers': CORS_HEADERS,
            'body': json.dumps({
                'short_url': f"https://bhjrt72dfk.execute-api.us-east-1.amazonaws.com/{short_code}",
                'original_url': original_url,
                'password_protected': bool(password)
            })
        }

    except Exception as e:
        logger.error("Error occurred: %s", str(e))
        return {
            'statusCode': 500,
            'headers': CORS_HEADERS,
            'body': json.dumps({'error': str(e)})
        }
