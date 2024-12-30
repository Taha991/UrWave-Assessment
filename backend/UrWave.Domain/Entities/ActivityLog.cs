using System;
using System.Collections.Generic;

namespace UrWave.Domain.Entities;

public partial class ActivityLog
{
    public Guid Id { get; set; }

    public string Activity { get; set; } = null!;

    public DateTime? Timestamp { get; set; }

    public Guid? UserId { get; set; }

    public virtual User? User { get; set; }
}
