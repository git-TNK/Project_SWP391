﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
#nullable disable
using System;
using System.Collections.Generic;

namespace KLM.Repository.Models;

public partial class OrderDetailTbl
{
    public string OrderId { get; set; }

    public string KitId { get; set; }

    public string KitName { get; set; }

    public int KitQuantity { get; set; }

    public decimal Price { get; set; }

    public virtual ProductKitTbl Kit { get; set; }

    public virtual OrderTbl Order { get; set; }
}