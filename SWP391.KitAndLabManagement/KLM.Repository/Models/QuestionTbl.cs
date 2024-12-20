﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
#nullable disable
using System;
using System.Collections.Generic;

namespace KLM.Repository.Models;

public partial class QuestionTbl
{
    public string QuestionId { get; set; }

    public string AccountId { get; set; }

    public int Turn { get; set; }

    public string Question { get; set; }

    public string LabName { get; set; }

    public string AttachedFile { get; set; }

    public DateTime DateOfQuestion { get; set; }

    public string Status { get; set; }

    public virtual AccountTbl Account { get; set; }

    public virtual AnswerTbl AnswerTbl { get; set; }
}