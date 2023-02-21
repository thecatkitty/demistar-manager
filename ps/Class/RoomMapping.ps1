class RoomMapping {
    [int]$Id
    [string]$Name

    RoomMapping([int]$Id, [string]$Name) {
        $this.Id = $Id
        $this.Name = $Name
    }
}
