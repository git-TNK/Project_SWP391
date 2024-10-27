﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
#nullable disable
using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace KLM.Repository.Models;

public partial class ProductKitTbl
{
    public string KitId { get; set; }

    public string Name { get; set; }

    public string Brand { get; set; }

    public string Description { get; set; }

    public string Picture { get; set; }

    public decimal Price { get; set; }

    public int Quantity { get; set; }

    public DateTime DateOfCreation { get; set; }

    public DateTime? DateOfDeletion { get; set; }

    public string Status { get; set; }

    public DateTime? DateOfChange { get; set; }

    //[JsonIgnore]

    public virtual ICollection<OrderDetailTbl> OrderDetailTbls { get; set; } = new List<OrderDetailTbl>();

    //[JsonIgnore]

    public virtual ICollection<LabTbl> Labs { get; set; } = new List<LabTbl>();

    //[JsonIgnore]

    public virtual ICollection<KtypeTbl> Ktypes { get; set; } = new List<KtypeTbl>();


}