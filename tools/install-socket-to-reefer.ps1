[CmdletBinding()]
param([string]$ProjectRoot="C:\\reefer",[string]$SourceRoot=(Join-Path $PSScriptRoot "..\\socket"))
$ErrorActionPreference="Stop"
$ProjectRoot=[IO.Path]::GetFullPath($ProjectRoot);$SourceRoot=[IO.Path]::GetFullPath($SourceRoot)
if(-not(Test-Path -LiteralPath $ProjectRoot -PathType Container)){throw "Project folder not found: $ProjectRoot. Clone/download the ReeferDude project first."}
foreach($file in @("index.html","socket.css","socket.js","README.md")){if(-not(Test-Path -LiteralPath (Join-Path $SourceRoot $file) -PathType Leaf)){throw "Missing source file: $(Join-Path $SourceRoot $file)"}}
$destination=Join-Path $ProjectRoot "public\\socket";New-Item -ItemType Directory -Force -Path $destination|Out-Null
foreach($file in @("index.html","socket.css","socket.js","README.md")){Copy-Item -LiteralPath (Join-Path $SourceRoot $file) -Destination (Join-Path $destination $file) -Force}
Write-Host "Installed The Socket at $destination" -ForegroundColor Green
Write-Host "Open /socket/ in your Vite application. Existing project files were not changed." -ForegroundColor Cyan
