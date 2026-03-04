$data = [Console]::In.ReadToEnd() | ConvertFrom-Json
$filePath = $data.tool_input.file_path

if ($filePath -match '\.env$' -or $filePath -match '[\\/]\.env$') {
    Write-Host "BLOQUEADO: No se permite leer archivos .env por razones de seguridad"
    exit 2
}

exit 0
