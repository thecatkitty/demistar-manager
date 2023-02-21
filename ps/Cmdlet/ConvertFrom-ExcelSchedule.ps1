
function ConvertFrom-ExcelSchedule([string]$FileName, [string]$Exclude, [RoomMapping[]]$Rooms) {
    # Załaduj dane z arkusza
    $Excel = New-Object -ComObject Excel.Application
    $Workbook = $Excel.Workbooks.Open((Get-Item $FileName).FullName)
    $Sheet = $Workbook.Worksheets.Item("harmonogram")

    $Schedule = $Sheet.UsedRange.Rows | ForEach-Object {
        if ($_.Cells[2].Formula -eq "day") {
            return
        }

        ConvertTo-Meeting -Row $_ -Rooms $Rooms
    } | Where-Object Title -NotLike $Exclude | Sort-Object Room, Start

    $Workbook.Close()
    $Excel.Quit()

    # Scal spotkania
    $Schedule | Group-Object Room, Title | ForEach-Object {
        $Item = $_.Group[0]
        for ($i = 1; $i -lt $_.Count; $i++) {
            if ($_.Group[$i].Start -eq $Item.Start.AddSeconds($Item.Duration)) {
                $Item.Duration += $_.Group[$i].Duration
            }
            else {
                $Item
                $Item = $_.Group[$i]
            }
        }
        $Item
    }
}
