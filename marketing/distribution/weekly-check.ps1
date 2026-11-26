# Table Share — Weekly live data check
# Run every Friday morning. Captures current stats for the tracker.

Write-Host "=== Table Share Weekly Stats ===" -ForegroundColor Cyan
Write-Host "Date: $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
Write-Host ""

# Lifetime tables
try {
    $stats = (Invoke-WebRequest -UseBasicParsing "https://table-share.org/api/stats" -TimeoutSec 10).Content | ConvertFrom-Json
    Write-Host "Lifetime tables: $($stats.total)" -ForegroundColor Green
} catch {
    Write-Host "Stats API failed: $_" -ForegroundColor Red
}

# Latency check
Write-Host ""
Write-Host "Latency check:" -ForegroundColor Cyan
$t = Measure-Command { Invoke-WebRequest -UseBasicParsing "https://table-share.org/api/stats" -TimeoutSec 10 | Out-Null }
Write-Host "  /api/stats response time: $([math]::Round($t.TotalMilliseconds, 0))ms"

# Critical pages still 200
Write-Host ""
Write-Host "Critical page health:" -ForegroundColor Cyan
$pages = @(
    "https://table-share.org",
    "https://table-share.org/pricing",
    "https://table-share.org/docs",
    "https://table-share.org/recover",
    "https://table-share.org/blog",
    "https://table-share.org/blog/sql-results-sharing",
    "https://table-share.org/blog/share-csv-online",
    "https://table-share.org/blog/share-excel-without-login",
    "https://table-share.org/blog/google-sheets-alternatives",
    "https://table-share.org/blog/pastebin-for-tables",
    "https://table-share.org/sitemap.xml",
    "https://table-share.org/robots.txt"
)
foreach ($url in $pages) {
    try {
        $r = Invoke-WebRequest -UseBasicParsing $url -TimeoutSec 10 -Method Head -ErrorAction Stop
        Write-Host "  [$($r.StatusCode)] $url" -ForegroundColor Green
    } catch {
        try {
            # Some configurations don't allow HEAD - try GET
            $r = Invoke-WebRequest -UseBasicParsing $url -TimeoutSec 10 -ErrorAction Stop
            Write-Host "  [$($r.StatusCode)] $url" -ForegroundColor Green
        } catch {
            Write-Host "  [ERR] $url" -ForegroundColor Red
        }
    }
}

# DMARC check
Write-Host ""
Write-Host "Email auth check:" -ForegroundColor Cyan
try {
    $dmarc = Resolve-DnsName -Name "_dmarc.table-share.org" -Type TXT -ErrorAction Stop
    $dmarcRecord = ($dmarc | Where-Object { $_.Type -eq "TXT" }).Strings -join " "
    if ($dmarcRecord -match "v=DMARC1") {
        Write-Host "  DMARC: LIVE" -ForegroundColor Green
    } else {
        Write-Host "  DMARC: not found" -ForegroundColor Yellow
    }
} catch {
    Write-Host "  DMARC: DNS lookup failed" -ForegroundColor Yellow
}

# Append to weekly log
$logLine = "$(Get-Date -Format 'yyyy-MM-dd'),$($stats.total)"
$logPath = "marketing\distribution\weekly-log.csv"
if (!(Test-Path $logPath)) {
    "date,lifetime_tables" | Out-File $logPath -Encoding utf8
}
$logLine | Out-File $logPath -Append -Encoding utf8

Write-Host ""
Write-Host "Logged to $logPath" -ForegroundColor Yellow
Write-Host "Update 07-tracker.md with this week's number."
