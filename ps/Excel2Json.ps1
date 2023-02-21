param([string]$ScheduleFile, [string]$RoomFile, [int[]]$Rooms = $null)

$Root = Split-Path -Path $MyInvocation.MyCommand.Definition -Parent
Import-Module -Name $Root/Demistar.psm1

$RoomMappings = Get-Content $RoomFile -Encoding UTF8 | ConvertTo-RoomMapping

ConvertFrom-ExcelSchedule -FileName $ScheduleFile -Exclude "Przerwa*" -Rooms $RoomMappings | ForEach-Object {
    if ($null -eq $Rooms) {
        $_.ToScene("")
    }
    elseif ($_.Room -in $Rooms) {
        $_.ToScene((($RoomMappings | Where-Object Id -eq $_.Room)[0].Name -split " ")[0] + " - ")
    }
}
