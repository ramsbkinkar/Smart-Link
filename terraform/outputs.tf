output "api_endpoint" {
  description = "Public URL for your shorten API"
  value       = "${aws_apigatewayv2_api.api.api_endpoint}/shorten"
}
