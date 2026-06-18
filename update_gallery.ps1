# Set root directory for gallery (relative to the script location)
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
if ([string]::IsNullOrEmpty($ScriptDir)) { $ScriptDir = Get-Location }
$GalleryDir = Join-Path $ScriptDir "gallery"
$OutFile = Join-Path $ScriptDir "js/gallery-data.js"

# Create folders if they do not exist
if (!(Test-Path $GalleryDir)) {
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
        # Get all images
        $Images = Get-ChildItem -Path $Dir.FullName -File | Where-Object { $_.Extension -match '^\.(jpg|jpeg|png|gif|webp|svg)$' }
        
        $ImgPaths = @()
        foreach ($Img in $Images) {
            # Create a web-safe relative path
            # gallery/SubFolder/Image.jpg
            # Note: PowerShell joins with system slashes, so replace backslashes with forward slashes for the web page
            $RelativePath = "gallery/$DirName/$($Img.Name)"
            $ImgPaths += $RelativePath
        }
        
        # Include folders even if they are empty for now, so the header displays
        $FolderObj = [PSCustomObject]@{
            folderName = $DirName
            images     = $ImgPaths
        }
        $FoldersData += $FolderObj
    }
}

# Convert to JSON string
$Json = ConvertTo-Json -InputObject $FoldersData -Depth 5 -Compress

# Output to js/gallery-data.js
$JsContent = "const galleryData = $Json;"
Set-Content -Path $OutFile -Value $JsContent -Encoding utf8

Write-Host "Gallery manifest successfully updated at: $OutFile"
Write-Host "Found $($FoldersData.Count) folder(s)."
