Add-Type -AssemblyName System.Drawing

$inputFile = "D:\Rotations\petromasila-logo-transparent.png"
$outputFile = "D:\Rotations\logo.png"

$bmp = New-Object System.Drawing.Bitmap($inputFile)

# Create a new bitmap for high-res output
$scale = 3
$newWidth = $bmp.Width * $scale
$newHeight = $bmp.Height * $scale
$newBmp = New-Object System.Drawing.Bitmap($newWidth, $newHeight)
$graphics = [System.Drawing.Graphics]::FromImage($newBmp)
$graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

# Draw the scaled image
$graphics.DrawImage($bmp, 0, 0, $newWidth, $newHeight)

# Now remove white background
for ($x = 0; $x -lt $newWidth; $x++) {
    for ($y = 0; $y -lt $newHeight; $y++) {
        $pixel = $newBmp.GetPixel($x, $y)
        if ($pixel.R -gt 230 -and $pixel.G -gt 230 -and $pixel.B -gt 230) {
            $newBmp.SetPixel($x, $y, [System.Drawing.Color]::Transparent)
        }
    }
}

$newBmp.Save($outputFile, [System.Drawing.Imaging.ImageFormat]::Png)

$graphics.Dispose()
$newBmp.Dispose()
$bmp.Dispose()
Write-Output "Image processed successfully!"
