using System.Diagnostics;

namespace UrWave.API.Middleware
{
    public class LoggingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<LoggingMiddleware> _logger;

        public LoggingMiddleware(RequestDelegate next, ILogger<LoggingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var stopwatch = Stopwatch.StartNew();

            // Log request details
            _logger.LogInformation("Handling request: {Method} {Path}", context.Request.Method, context.Request.Path);

            try
            {
                await _next(context); // Call the next middleware
            }
            finally
            {
                stopwatch.Stop();
                // Log response details and elapsed time
                _logger.LogInformation("Completed request: {Method} {Path} in {ElapsedMilliseconds}ms",
                    context.Request.Method, context.Request.Path, stopwatch.ElapsedMilliseconds);
            }
        }
    }
}
