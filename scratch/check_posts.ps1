$headers = @{
    "apikey" = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2cnNqYmZrYndneGh6Y3ltbWpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcwODY3MDIsImV4cCI6MjEwMjY2MjcwMn0.lop9QgoUUJcss7vN6D64YCfnIyU5JVXM-SFCyR__G-U"
}

$allPosts = Invoke-RestMethod -Uri "https://hvrsjbfkbwgxhzcymmjg.supabase.co/rest/v1/posts?select=*" -Headers $headers
Write-Output "--- ALL POSTS IN SUPABASE ---"
Write-Output ($allPosts | ConvertTo-Json -Depth 5)
