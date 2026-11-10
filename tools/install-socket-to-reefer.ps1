[CmdletBinding()]
param([string]$ProjectRoot = "C:\\reefer")
$ErrorActionPreference = "Stop"
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$ProjectRoot = [IO.Path]::GetFullPath($ProjectRoot)
if (-not (Test-Path -LiteralPath $ProjectRoot -PathType Container)) { throw "Project folder not found: $ProjectRoot" }
$branch = "feat/gravity-gone-socket"
$base = "https://raw.githubusercontent.com/reeferguyai/Reeferdude/" + $branch + "/"
$temp = Join-Path $env:TEMP ("reeferdude-socket-" + [guid]::NewGuid().ToString("N"))
$publicDest = Join-Path $ProjectRoot "public\\socket"
$featureDest = Join-Path $ProjectRoot "src\\features"
New-Item -ItemType Directory -Force -Path $temp,$publicDest,$featureDest | Out-Null
$downloads = @(
  @{ Url=$base+"socket/index.html"; Name="index.html"; Dest=$publicDest },
  @{ Url=$base+"socket/socket.css"; Name="socket.css"; Dest=$publicDest },
  @{ Url=$base+"socket/socket.js"; Name="socket.js"; Dest=$publicDest },
  @{ Url=$base+"socket/README.md"; Name="README.md"; Dest=$publicDest },
  @{ Url=$base+"src/features/GravityGoneNebula.tsx"; Name="GravityGoneNebula.tsx"; Dest=$featureDest },
  @{ Url=$base+"src/features/gravity-gone-nebula.css"; Name="gravity-gone-nebula.css"; Dest=$featureDest }
)
try {
  foreach ($item in $downloads) {
    $target = Join-Path $temp $item.Name
    Invoke-WebRequest -Uri $item.Url -OutFile $target -UseBasicParsing
    if (-not (Test-Path -LiteralPath $target) -or (Get-Item -LiteralPath $target).Length -lt 50) { throw "Download verification failed: $($item.Name)" }
    Copy-Item -LiteralPath $target -Destination (Join-Path $item.Dest $item.Name) -Force
    Write-Host ("Installed " + $item.Name) -ForegroundColor Green
  }
} finally {
  if (Test-Path -LiteralPath $temp) { Remove-Item -LiteralPath $temp -Recurse -Force }
}
Write-Host ""
Write-Host "The Socket is installed at $publicDest" -ForegroundColor Green
Write-Host "Open /socket/ in your Vite app. The Framer Motion component is in $featureDest." -ForegroundColor Cyan
Write-Host "This installer only creates/replaces these six named files. It does not delete other project content."
