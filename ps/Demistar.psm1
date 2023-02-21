$Root = Split-Path -Path $MyInvocation.MyCommand.Definition -Parent
. ("$Root/Class/Meeting.ps1")
. ("$Root/Class/RoomMapping.ps1")
. ("$Root/Cmdlet/ConvertTo-Meeting.ps1")
. ("$Root/Cmdlet/ConvertTo-RoomMapping.ps1")
. ("$Root/Cmdlet/ConvertFrom-ExcelSchedule.ps1")

Export-ModuleMember -Function ConvertTo-Meeting
Export-ModuleMember -Function ConvertTo-RoomMapping
Export-ModuleMember -Function ConvertFrom-ExcelSchedule
