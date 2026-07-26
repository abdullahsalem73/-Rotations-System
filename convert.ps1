Add-Type -AssemblyName System.Drawing
$img = New-Object System.Drawing.Bitmap('D:\Rotations\image_1448-02-12_00-27-12.jpg')
$img.Save('D:\Rotations\logo.png', [System.Drawing.Imaging.ImageFormat]::Png)
$img.Dispose()
