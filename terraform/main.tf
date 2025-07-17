provider "aws" {
  region = "us-east-1"  # or your preferred region
}

# DynamoDB Table
resource "aws_dynamodb_table" "short_links" {
  name         = "ShortLinks"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "short_code"

  attribute {
    name = "short_code"
    type = "S"
  }

  ttl {
    attribute_name = "expiry_time"
    enabled        = true
  }
}

# IAM Role for Lambda
resource "aws_iam_role" "lambda_exec" {
  name = "lambda_exec_role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Action = "sts:AssumeRole",
      Effect = "Allow",
      Principal = {
        Service = "lambda.amazonaws.com"
      }
    }]
  })
}

# IAM Policy Attachment
resource "aws_iam_role_policy_attachment" "dynamodb_attach" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess"
}

resource "aws_iam_role_policy_attachment" "logs_attach" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/CloudWatchLogsFullAccess"
}

# Zip Lambda code using local-exec
data "archive_file" "lambda_zip" {
  type        = "zip"
  source_dir  = "${path.module}/lambda"
  output_path = "${path.module}/lambda.zip"
}

# Lambda Function
resource "aws_lambda_function" "shorten_url" {
  function_name = "shortenLinkFunction"
  filename      = data.archive_file.lambda_zip.output_path
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256
  handler       = "shorten.lambda_handler"
  runtime       = "python3.9"
  role          = aws_iam_role.lambda_exec.arn
}

# API Gateway
resource "aws_apigatewayv2_api" "api" {
  name          = "link-shortener-api"
  protocol_type = "HTTP"
  cors_configuration {
    allow_headers = ["*"]
    allow_methods = ["*"]
    allow_origins = ["*"]
    expose_headers = ["*"]
    max_age = 300
  }
}

resource "aws_apigatewayv2_integration" "lambda_integration" {
  api_id           = aws_apigatewayv2_api.api.id
  integration_type = "AWS_PROXY"
  integration_uri  = aws_lambda_function.shorten_url.invoke_arn
  integration_method = "POST"
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "route" {
  api_id    = aws_apigatewayv2_api.api.id
  route_key = "POST /shorten"
  target    = "integrations/${aws_apigatewayv2_integration.lambda_integration.id}"
}

resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.api.id
  name        = "$default"
  auto_deploy = true

  default_route_settings {
    throttling_burst_limit = 100
    throttling_rate_limit  = 50
  }
}

# Lambda Permission to Allow API Gateway
resource "aws_lambda_permission" "api_gateway" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.shorten_url.arn
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.api.execution_arn}/*/*"
}

resource "aws_lambda_function" "redirect_link" {
  function_name = "redirectLinkFunction"
  filename      = data.archive_file.lambda_zip.output_path
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256
  handler       = "redirect.lambda_handler"
  runtime       = "python3.9"
  role          = aws_iam_role.lambda_exec.arn
}

resource "aws_apigatewayv2_integration" "redirect_integration" {
  api_id                    = aws_apigatewayv2_api.api.id
  integration_type          = "AWS_PROXY"
  integration_uri           = aws_lambda_function.redirect_link.invoke_arn
  integration_method        = "POST"  # ✅ FIXED: Must be POST
  payload_format_version    = "2.0"
}

resource "aws_apigatewayv2_route" "redirect_route" {
  api_id    = aws_apigatewayv2_api.api.id
  route_key = "GET /{short_code}"
  target    = "integrations/${aws_apigatewayv2_integration.redirect_integration.id}"
}

resource "aws_lambda_permission" "redirect_permission" {
  statement_id  = "AllowAPIGatewayRedirectInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.redirect_link.arn
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.api.execution_arn}/*/*"
}

resource "aws_lambda_function" "analytics_link" {
  function_name = "analyticsLinkFunction"
  filename      = data.archive_file.lambda_zip.output_path
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256
  handler       = "analytics.lambda_handler"
  runtime       = "python3.9"
  role          = aws_iam_role.lambda_exec.arn
}

resource "aws_apigatewayv2_integration" "analytics_integration" {
  api_id           = aws_apigatewayv2_api.api.id
  integration_type = "AWS_PROXY"
  integration_uri  = aws_lambda_function.analytics_link.invoke_arn
  integration_method = "POST"  # ✅ Always POST for HTTP APIs
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "analytics_route" {
  api_id    = aws_apigatewayv2_api.api.id
  route_key = "GET /analytics/{short_code}"
  target    = "integrations/${aws_apigatewayv2_integration.analytics_integration.id}"
}

resource "aws_lambda_permission" "analytics_permission" {
  statement_id  = "AllowAPIGatewayAnalyticsInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.analytics_link.arn
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.api.execution_arn}/*/*"
}