﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
#nullable disable
using System;
using System.Collections.Generic;

namespace KLM.Repository.Models;

public partial class AvailableLabTbl
{
    public string LabId { get; set; }

    public string OrderId { get; set; }

    public int TurnsRemaining { get; set; }

    public string LabName { get; set; }

    public virtual OrderTbl Order { get; set; }
}