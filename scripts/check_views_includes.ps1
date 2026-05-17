$root = 'C:\Apache24\htdocs\cotix'
$views = Get-ChildItem -Path (Join-Path $root 'views') -Filter *.php -File -Recurse
$out = @()
foreach($f in $views){
    $lines = Get-Content -Path $f.FullName -ErrorAction SilentlyContinue
    for($i=0;$i -lt $lines.Length; $i++){
        $line = $lines[$i].Trim()
        if ($line -match '^(require_once|require|include_once|include)\s*(\(.+\)|.+);'){
            $expr = $line
            $resolved = $null
            $exists = $false

            # try to extract a quoted path by finding first quote char
            $single = $line.IndexOf("'")
            $double = $line.IndexOf('"')
            $start = -1
            $quoteChar = ''
            if ($single -ge 0 -and ($double -eq -1 -or $single -lt $double)) { $start = $single; $quoteChar = "'" }
            elseif ($double -ge 0) { $start = $double; $quoteChar = '"' }
            if ($start -ge 0) {
                $end = $line.IndexOf($quoteChar, $start + 1)
                if ($end -gt $start) {
                    $p = $line.Substring($start + 1, $end - $start - 1)
                    if ($line -match '__DIR__'){
                        $resolved = Join-Path $f.DirectoryName ($p -replace '^\./','')
                    }
                    elseif ($p.StartsWith('/')){
                        $resolved = Join-Path $root ($p.TrimStart('/'))
                    }
                    else{
                        $resolved = Join-Path $f.DirectoryName $p
                    }
                }
            }
            elseif ($line -match "ROOT\s*\.\s*'([^']+)'"){
                $p = $matches[1]
                $resolved = Join-Path $root ($p.TrimStart('/'))
            }
            elseif ($line -match '__DIR__\s*\.\s*"([^"]+)"'){
                $p = $matches[1]
                $resolved = Join-Path $f.DirectoryName ($p -replace '^\\.\\/','')
            }

            if ($resolved){
                $exists = Test-Path -Path $resolved
            }
            else{
                $resolved = 'UNRESOLVED'
            }

            $out += [PSCustomObject]@{
                view = $f.FullName
                lineNumber = $i+1
                expression = $expr
                resolved = $resolved
                exists = $exists
            }
        }
    }
}
$out | Sort-Object view,lineNumber | Format-Table -AutoSize
$out | Export-Csv -Path (Join-Path $root 'tmp\views_includes_report.csv') -NoTypeInformation -Force
Write-Host "Report saved to: $root\tmp\views_includes_report.csv"
