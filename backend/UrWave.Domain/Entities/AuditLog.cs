using System;
using System.Collections.Generic;

namespace UrWave.Domain.Entities;

public partial class AuditLog
{
    public Guid Id { get; set; }

    public string TableName { get; set; } = null!;

    public string Operation { get; set; } = null!;

    public Guid RecordId { get; set; }

    public string? UserId { get; set; }

    public DateTime? Timestamp { get; set; }

    public string? OldValues { get; set; }

    public string? NewValues { get; set; }
}
