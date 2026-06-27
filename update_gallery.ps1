# Set root directory for gallery (relative to the script location)
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
if ([string]::IsNullOrEmpty($ScriptDir)) { $ScriptDir = Get-Location }

Push-Location $ScriptDir

# Check if node_modules exists, if not run npm install
$NodeModules = Join-Path $ScriptDir "node_modules"
if (!(Test-Path $NodeModules)) {
    Write-Host "node_modules not found. Installing dependencies..."
    npm install
}

# Run the Node.js optimization pipeline
node scripts/update-gallery.js

Pop-Location

