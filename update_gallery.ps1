# Set root directory for gallery (relative to the script location)
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
if ([string]::IsNullOrEmpty($ScriptDir)) { $ScriptDir = Get-Location }
$GalleryDir = Join-Path $ScriptDir "public/gallery"
$OutFile = Join-Path $ScriptDir "js/gallery-data.js"
$ReactOutFile = Join-Path $ScriptDir "src/gallery-data.js"

# Create folders if they do not exist
if (!(Test-Path $GalleryDir)) {
    # Ensure public folder exists
    $PublicDir = Join-Path $ScriptDir "public"
    if (!(Test-Path $PublicDir)) {
        New-Item -ItemType Directory -Path $PublicDir | Out-Null
    }
    New-Item -ItemType Directory -Path $GalleryDir | Out-Null
    # Create some mock folders for demonstration
    New-Item -ItemType Directory -Path (Join-Path $GalleryDir "Veterans Memorial Ride 2026") | Out-Null
    New-Item -ItemType Directory -Path (Join-Path $GalleryDir "Clubhouse Events") | Out-Null
    New-Item -ItemType Directory -Path (Join-Path $GalleryDir "Spring Charity Poker Run") | Out-Null
}

if (!(Test-Path (Join-Path $ScriptDir "js"))) {
    New-Item -ItemType Directory -Path (Join-Path $ScriptDir "js") | Out-Null
}

$FoldersData = @()

# Scan directories in the gallery folder
if (Test-Path $GalleryDir) {
    $SubDirs = Get-ChildItem -Path $GalleryDir -Directory
    foreach ($Dir in $SubDirs) {
        $DirName = $Dir.Name
        # Strip leading numbers followed by an underscore or hyphen for the display name
        # e.g., "01_Cannonball Poker Run" becomes "Cannonball Poker Run"
        $DisplayName = $DirName -replace '^\d+[_-]', ''
        
        # Get all images
        $Images = Get-ChildItem -Path $Dir.FullName -File | Where-Object { $_.Extension -match '^\.(jpg|jpeg|png|gif|webp|svg)$' }
        
        $ImgPaths = @()
        foreach ($Img in $Images) {
            # Use the original $DirName in the disk path so files serve correctly
            $RelativePath = "gallery/$DirName/$($Img.Name)"
            $ImgPaths += $RelativePath
        }
        
        # Include folders even if they are empty for now, so the header displays
        $FolderObj = [PSCustomObject]@{
            folderName = $DisplayName
            images     = $ImgPaths
        }
        $FoldersData += $FolderObj
    }
}

# Convert to JSON string
$Json = ConvertTo-Json -InputObject $FoldersData -Depth 5 -Compress

# Output to js/gallery-data.js (legacy/fallback)
$JsContent = "const galleryData = $Json;"
Set-Content -Path $OutFile -Value $JsContent -Encoding utf8

# Output to src/gallery-data.js (React ES module)
$ReactJsContent = "export const galleryData = $Json;"
Set-Content -Path $ReactOutFile -Value $ReactJsContent -Encoding utf8

Write-Host "Gallery manifests successfully updated!"
Write-Host "Found $($FoldersData.Count) folder(s)."
