import json
import boto3
import logging
from decimal import Decimal

# Setup logger for CloudWatch debugging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# DynamoDB setup
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('ShortLinks')

# CORS headers
CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Methods": "OPTIONS,GET"
}

# Handle decimal serialization from DynamoDB
class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            if obj % 1 == 0:
                return int(obj)
            return float(obj)
        return super(DecimalEncoder, self).default(obj)

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
        path_params = event.get('pathParameters') or {}
        short_code = path_params.get('short_code')

        if not short_code:
            return {
                "statusCode": 400,
                "headers": CORS_HEADERS,
                "body": json.dumps({"error": "Short code is required"})
            }

        response = table.get_item(Key={'short_code': short_code})
        item = response.get('Item')

        if not item:
            return {
                "statusCode": 404,
                "headers": CORS_HEADERS,
                "body": json.dumps({"error": "Short code not found"})
            }

        return {
            "statusCode": 200,
            "headers": CORS_HEADERS,
            "body": json.dumps({
                "short_code": item['short_code'],
                "original_url": item['original_url'],
                "clicks": item['clicks'],
                "created_at": item['created_at'],
                "expiry_time": item['expiry_time'],
                "password_protected": bool(item.get('password_hash'))
            }, cls=DecimalEncoder)
        }

    except Exception as e:
        logger.error("Error occurred: %s", str(e))
        return {
            "statusCode": 500,
            "headers": CORS_HEADERS,
            "body": json.dumps({"error": str(e)})
        }
