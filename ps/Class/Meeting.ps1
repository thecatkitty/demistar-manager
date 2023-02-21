class Meeting {
    [int]$Room
    [datetime]$Start
    [int]$Duration
    [string]$Title
    [string]$Speaker

    Meeting([int]$Room, [datetime]$Start, [datetime]$End, [string]$Title, [string]$Speaker) {
        $this.Room = $Room
        $this.Start = $Start
        $this.Duration = ($End - $Start).TotalSeconds
        if ($this.Duration -le 0) {
            $this.Duration += 24 * 3600
        }
        $this.Title = $Title
        $this.Speaker = $Speaker
    }
    
    [bool] Equals([object]$Object) {
        return ($this.Room -eq $Object.Room) -and ($this.Start -eq $Object.Start) -and ($this.Duration -eq $Object.Duration) -and ($this.Title -eq $Object.Title) -and ($this.Speaker -eq $Object.Speaker)
    }

    [string] ToScene([string]$SpeakerPrefix) {
        return ConvertTo-Json -Compress @{
            "room"       = $this.Room
            "start"      = $this.Start.ToString("yyyy-MM-dd\THH:mm:ss")
            "duration"   = $this.Duration
            "screentime" = 30
            "stage"      = @{
                "name"  = "meeting"
                "title" = $this.Title
                "host"  = $SpeakerPrefix + $this.Speaker
            }
        }
    }
}
