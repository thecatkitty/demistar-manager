function ConvertTo-Meeting($Row, [RoomMapping[]]$Rooms) {
    return [Meeting]::new(
        ($Rooms | Where-Object Name -eq $Row.Cells[8].Formula)[0].Id,
        [datetime]::Parse($Row.Cells[2].Formula + " " + $Row.Cells[3].Formula),
        [datetime]::Parse($Row.Cells[2].Formula + " " + $Row.Cells[4].Formula),
        $Row.Cells[5].Formula,
        $Row.Cells[7].Formula
    )
}
