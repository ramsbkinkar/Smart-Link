terraform {
  required_providers {
    random = {
      source = "hashicorp/random"
    }
  }
}

# Unique suffix for the bucket name
resource "random_string" "bucket_suffix" {
  length  = 8
  upper   = false
  special = false
}

# S3 bucket to host the static React build (private, accessed only via CloudFront)
resource "aws_s3_bucket" "frontend" {
  bucket = "smartlink-frontend-${random_string.bucket_suffix.result}"
  force_destroy = true

  tags = {
    Project = "SmartLink"
  }
}

# Block all public access (only CloudFront OAI will read)
resource "aws_s3_bucket_public_access_block" "frontend" {
  bucket                  = aws_s3_bucket.frontend.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# CloudFront Origin Access Identity (legacy but simple)
resource "aws_cloudfront_origin_access_identity" "frontend_oai" {
  comment = "OAI for SmartLink React frontend"
}

# Grant the OAI read access to the bucket
resource "aws_s3_bucket_policy" "frontend" {
  bucket = aws_s3_bucket.frontend.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Sid    = "AllowCloudFrontRead",
        Effect  = "Allow",
        Action  = ["s3:GetObject"],
        Resource = "${aws_s3_bucket.frontend.arn}/*",
        Principal = {
          AWS = aws_cloudfront_origin_access_identity.frontend_oai.iam_arn
        }
      }
    ]
  })
}

# CloudFront distribution serving the React app over HTTPS
resource "aws_cloudfront_distribution" "frontend" {
  enabled = true

  origin {
    domain_name = aws_s3_bucket.frontend.bucket_regional_domain_name
    origin_id   = "s3-frontend-origin"

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.frontend_oai.cloudfront_access_identity_path
    }
  }

  default_root_object = "index.html"

  default_cache_behavior {
    target_origin_id       = "s3-frontend-origin"
    viewer_protocol_policy = "redirect-to-https"

    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]

    compress = true

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
  }

  custom_error_response {
    error_code            = 404
    response_code         = 200
    response_page_path    = "/index.html"
  }
    custom_error_response {
    error_code         = 403
    response_code      = 200
    response_page_path = "/index.html"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  price_class = "PriceClass_100"

  tags = {
    Project = "SmartLink"
  }
}

# Outputs
output "frontend_bucket_name" {
  description = "S3 bucket hosting the frontend"
  value       = aws_s3_bucket.frontend.bucket
}

output "frontend_distribution_id" {
  description = "CloudFront distribution ID for the frontend"
  value       = aws_cloudfront_distribution.frontend.id
}

output "frontend_domain_name" {
  description = "CloudFront domain name (HTTPS)"
  value       = aws_cloudfront_distribution.frontend.domain_name
} 