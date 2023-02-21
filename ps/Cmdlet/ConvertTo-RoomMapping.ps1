function ConvertTo-RoomMapping {
    begin {}
    process {
        $Parts = $_ -split "`t"
        [RoomMapping]::new([int]$Parts[0], $Parts[1])
    }
    end {}
}
