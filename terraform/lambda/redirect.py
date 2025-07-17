import json
import boto3
from utils import hash_password

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('ShortLinks')

# CORS headers for browser compatibility
CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Methods": "OPTIONS,GET"
}

def lambda_handler(event, context):
    print("EVENT:", json.dumps(event))

    try:
        short_code = event['pathParameters']['short_code']
        response = table.get_item(Key={'short_code': short_code})
        item = response.get('Item')

        if not item:
            return {
                "statusCode": 404,
                "body": json.dumps({"error": "Short link not found"}),
                "headers": CORS_HEADERS
            }

        # Check if password is required
        if item.get('password_hash'):
            # Get password from query string (e.g., ?password=secret123)
            query = event.get('queryStringParameters') or {}
            input_password = query.get('password')

            if not input_password:
                html_page = f"""
                <!DOCTYPE html>
                <html lang=\"en\">
                <head>
                    <meta charset=\"UTF-8\" />
                    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />
                    <title>Password Required</title>
                    <script src=\"https://cdn.tailwindcss.com\"></script>
                </head>
                <body class=\"min-h-screen flex items-center justify-center bg-gray-100 p-4\">
                    <div class=\"max-w-md w-full bg-white shadow-lg rounded-lg p-8 space-y-6\">
                        <h1 class=\"text-2xl font-semibold text-gray-800 text-center\">Protected Link</h1>
                        <p class=\"text-gray-600 text-sm text-center\">This link is password protected. Please enter the password to continue.</p>
                        <form method=\"GET\" action=\"/{short_code}\" class=\"space-y-4\">
                            <input type=\"password\" name=\"password\" placeholder=\"Password\" required class=\"w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400\" />
                            <button type=\"submit\" class=\"w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded transition-colors\">Unlock</button>
                        </form>
                    </div>
                </body>
                </html>
                """

                return {
                    "statusCode": 200,
                    "body": html_page,
                    "headers": {
                        **CORS_HEADERS,
                        "Content-Type": "text/html"
                    }
                }

            hashed_input = hash_password(input_password)
            if hashed_input != item['password_hash']:
                return {
                    "statusCode": 403,
                    "body": json.dumps({"error": "Incorrect password"}),
                    "headers": CORS_HEADERS
                }

        # Update click count
        table.update_item(
            Key={'short_code': short_code},
            UpdateExpression="SET clicks = clicks + :inc",
            ExpressionAttributeValues={":inc": 1}
        )

        return {
            "statusCode": 302,
            "headers": {
                **CORS_HEADERS,
                "Location": item['original_url']
            }
        }

    except Exception as e:
        print("ERROR:", str(e))
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)}),
            "headers": CORS_HEADERS
        }
