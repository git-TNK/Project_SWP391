﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
#nullable disable
using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace KLM.Repository.Models;

public partial class Swp391Context : DbContext
{
    public Swp391Context()
    {
    }

    public Swp391Context(DbContextOptions<Swp391Context> options)
        : base(options)
    {
    }

    public virtual DbSet<AccountTbl> AccountTbls { get; set; }

    public virtual DbSet<AnswerTbl> AnswerTbls { get; set; }

    public virtual DbSet<KtypeTbl> KtypeTbls { get; set; }

    public virtual DbSet<LabTbl> LabTbls { get; set; }

    public virtual DbSet<LtypeTbl> LtypeTbls { get; set; }

    public virtual DbSet<OrderDetailTbl> OrderDetailTbls { get; set; }

    public virtual DbSet<OrderTbl> OrderTbls { get; set; }

    public virtual DbSet<ProductKitTbl> ProductKitTbls { get; set; }

    public virtual DbSet<QuestionTbl> QuestionTbls { get; set; }


    public static string GetConnectionString(string connectionStringName)
    {
        var config = new ConfigurationBuilder()
            .SetBasePath(AppDomain.CurrentDomain.BaseDirectory)
            .AddJsonFile("appsettings.json")
            .Build();

        string connectionString = config.GetConnectionString(connectionStringName);
        return connectionString;
    }
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseSqlServer(GetConnectionString("DefaultConnection"));


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AccountTbl>(entity =>
        {
            entity.HasKey(e => e.AccountId).HasName("PK__Account___349DA586CC73AAEA");

            entity.ToTable("Account_TBL");

            entity.HasIndex(e => e.UserName, "UQ__Account___C9F2845615E2A073").IsUnique();

            entity.Property(e => e.AccountId)
                .HasMaxLength(6)
                .HasColumnName("AccountID");
            entity.Property(e => e.Address).HasMaxLength(255);
            entity.Property(e => e.Email)
                .IsRequired()
                .HasMaxLength(100);
            entity.Property(e => e.FullName)
                .IsRequired()
                .HasMaxLength(100);
            entity.Property(e => e.Password).HasMaxLength(50);
            entity.Property(e => e.PhoneNumber).HasMaxLength(20);
            entity.Property(e => e.Role)
                .IsRequired()
                .HasMaxLength(10);
            entity.Property(e => e.Status)
                .IsRequired()
                .HasMaxLength(20);
            entity.Property(e => e.UserName)
                .IsRequired()
                .HasMaxLength(50);
        });

        modelBuilder.Entity<AnswerTbl>(entity =>
        {
            entity.HasKey(e => e.AnswerId).HasName("PK__Answer_T__D482502471C6DCF5");

            entity.ToTable("Answer_TBL");

            entity.HasIndex(e => e.QuestionId, "UQ__Answer_T__0DC06F8D50518971").IsUnique();

            entity.Property(e => e.AnswerId)
                .HasMaxLength(6)
                .HasColumnName("AnswerID");
            entity.Property(e => e.AccountId)
                .IsRequired()
                .HasMaxLength(6)
                .HasColumnName("AccountID");
            entity.Property(e => e.LabName)
                .IsRequired()
                .HasMaxLength(300);
            entity.Property(e => e.QuestionId)
                .IsRequired()
                .HasMaxLength(6)
                .HasColumnName("QuestionID");
            entity.Property(e => e.Status)
                .IsRequired()
                .HasMaxLength(20);

            entity.HasOne(d => d.Account).WithMany(p => p.AnswerTbls)
                .HasForeignKey(d => d.AccountId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Answer_TB__Accou__00200768");

            entity.HasOne(d => d.Question).WithOne(p => p.AnswerTbl)
                .HasForeignKey<AnswerTbl>(d => d.QuestionId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Answer_TB__Quest__7F2BE32F");
        });

        modelBuilder.Entity<KtypeTbl>(entity =>
        {
            entity.HasKey(e => e.KtypeId).HasName("PK__KType_TB__8495748F7D143BC9");

            entity.ToTable("KType_TBL");

            entity.HasIndex(e => e.TypeName, "UQ__KType_TB__D4E7DFA87FD18929").IsUnique();

            entity.Property(e => e.KtypeId)
                .HasMaxLength(6)
                .HasColumnName("KTypeID");
            entity.Property(e => e.TypeName)
                .IsRequired()
                .HasMaxLength(100);
        });

        modelBuilder.Entity<LabTbl>(entity =>
        {
            entity.HasKey(e => e.LabId).HasName("PK__Lab_TBL__EDBD773A21086DB3");

            entity.ToTable("Lab_TBL");

            entity.HasIndex(e => e.Name, "UQ__Lab_TBL__737584F62E89EE14").IsUnique();

            entity.Property(e => e.LabId)
                .HasMaxLength(6)
                .HasColumnName("LabID");
            entity.Property(e => e.DateOfChangeLab).HasColumnType("datetime");
            entity.Property(e => e.DateOfCreation).HasColumnType("datetime");
            entity.Property(e => e.DateOfDeletion).HasColumnType("datetime");
            entity.Property(e => e.Description).IsRequired();
            entity.Property(e => e.Document).IsRequired();
            entity.Property(e => e.Name)
                .IsRequired()
                .HasMaxLength(100);
            entity.Property(e => e.Status)
                .IsRequired()
                .HasMaxLength(20);

            entity.HasMany(d => d.Kits).WithMany(p => p.Labs)
                .UsingEntity<Dictionary<string, object>>(
                    "ContainTbl",
                    r => r.HasOne<ProductKitTbl>().WithMany()
                        .HasForeignKey("KitId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK__Contain_T__KitID__2E1BDC42"),
                    l => l.HasOne<LabTbl>().WithMany()
                        .HasForeignKey("LabId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK__Contain_T__LabID__2D27B809"),
                    j =>
                    {
                        j.HasKey("LabId", "KitId").HasName("PK__Contain___812B994EE4DF35C0");
                        j.ToTable("Contain_TBL");
                        j.IndexerProperty<string>("LabId")
                            .HasMaxLength(6)
                            .HasColumnName("LabID");
                        j.IndexerProperty<string>("KitId")
                            .HasMaxLength(6)
                            .HasColumnName("KitID");
                    });

            entity.HasMany(d => d.Ltypes).WithMany(p => p.Labs)
                .UsingEntity<Dictionary<string, object>>(
                    "LabTypeTbl",
                    r => r.HasOne<LtypeTbl>().WithMany()
                        .HasForeignKey("LtypeId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK__LabType_T__LType__412EB0B6"),
                    l => l.HasOne<LabTbl>().WithMany()
                        .HasForeignKey("LabId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK__LabType_T__LabID__403A8C7D"),
                    j =>
                    {
                        j.HasKey("LabId", "LtypeId").HasName("PK__LabType___E5F4A564A0439787");
                        j.ToTable("LabType_TBL");
                        j.IndexerProperty<string>("LabId")
                            .HasMaxLength(6)
                            .HasColumnName("LabID");
                        j.IndexerProperty<string>("LtypeId")
                            .HasMaxLength(6)
                            .HasColumnName("LTypeID");
                    });
        });

        modelBuilder.Entity<LtypeTbl>(entity =>
        {
            entity.HasKey(e => e.LtypeId).HasName("PK__LType_TB__849D25E1308FA39B");

            entity.ToTable("LType_TBL");

            entity.HasIndex(e => e.TypeName, "UQ__LType_TB__D4E7DFA8ED78C8AE").IsUnique();

            entity.Property(e => e.LtypeId)
                .HasMaxLength(6)
                .HasColumnName("LTypeID");
            entity.Property(e => e.TypeName)
                .IsRequired()
                .HasMaxLength(100);
        });

        modelBuilder.Entity<OrderDetailTbl>(entity =>
        {
            entity.HasKey(e => new { e.KitId, e.OrderId }).HasName("PK__OrderDet__2557E2FD4A59940C");

            entity.ToTable("OrderDetail_TBL");

            entity.Property(e => e.KitId)
                .HasMaxLength(6)
                .HasColumnName("KitID");
            entity.Property(e => e.OrderId)
                .HasMaxLength(6)
                .HasColumnName("OrderID");
            entity.Property(e => e.KitName)
                .IsRequired()
                .HasMaxLength(300);
            entity.Property(e => e.Price).HasColumnType("decimal(20, 2)");

            entity.HasOne(d => d.Kit).WithMany(p => p.OrderDetailTbls)
                .HasForeignKey(d => d.KitId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__OrderDeta__KitID__47DBAE45");

            entity.HasOne(d => d.Order).WithMany(p => p.OrderDetailTbls)
                .HasForeignKey(d => d.OrderId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__OrderDeta__Order__46E78A0C");
        });

        modelBuilder.Entity<OrderTbl>(entity =>
        {
            entity.HasKey(e => e.OrderId).HasName("PK__Order_TB__C3905BAF52BCEA70");

            entity.ToTable("Order_TBL");

            entity.Property(e => e.OrderId)
                .HasMaxLength(6)
                .HasColumnName("OrderID");
            entity.Property(e => e.AccountId)
                .IsRequired()
                .HasMaxLength(6)
                .HasColumnName("AccountID");
            entity.Property(e => e.Address)
                .IsRequired()
                .HasMaxLength(255);
            entity.Property(e => e.Note).HasMaxLength(100);
            entity.Property(e => e.OrderDate).HasColumnType("datetime");
            entity.Property(e => e.Price).HasColumnType("decimal(20, 2)");
            entity.Property(e => e.ReceiveDate).HasColumnType("datetime");
            entity.Property(e => e.Status)
                .IsRequired()
                .HasMaxLength(20);

            entity.HasOne(d => d.Account).WithMany(p => p.OrderTbls)
                .HasForeignKey(d => d.AccountId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Order_TBL__Accou__440B1D61");
        });

        modelBuilder.Entity<ProductKitTbl>(entity =>
        {
            entity.HasKey(e => e.KitId).HasName("PK__ProductK__C96EE7474C8B4388");

            entity.ToTable("ProductKit_TBL");

            entity.HasIndex(e => e.Name, "UQ__ProductK__737584F6585C0CD7").IsUnique();

            entity.Property(e => e.KitId)
                .HasMaxLength(6)
                .HasColumnName("KitID");
            entity.Property(e => e.Brand)
                .IsRequired()
                .HasMaxLength(100);
            entity.Property(e => e.DateOfChange).HasColumnType("datetime");
            entity.Property(e => e.DateOfCreation).HasColumnType("datetime");
            entity.Property(e => e.DateOfDeletion).HasColumnType("datetime");
            entity.Property(e => e.Description).IsRequired();
            entity.Property(e => e.Name)
                .IsRequired()
                .HasMaxLength(300);
            entity.Property(e => e.Picture).IsRequired();
            entity.Property(e => e.Price).HasColumnType("decimal(20, 2)");
            entity.Property(e => e.Status)
                .IsRequired()
                .HasMaxLength(20);

            entity.HasMany(d => d.Ktypes).WithMany(p => p.Kits)
                .UsingEntity<Dictionary<string, object>>(
                    "KitTypeTbl",
                    r => r.HasOne<KtypeTbl>().WithMany()
                        .HasForeignKey("KtypeId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK__KitType_T__KType__37A5467C"),
                    l => l.HasOne<ProductKitTbl>().WithMany()
                        .HasForeignKey("KitId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK__KitType_T__KitID__36B12243"),
                    j =>
                    {
                        j.HasKey("KitId", "KtypeId").HasName("PK__KitType___2127B00F15B54770");
                        j.ToTable("KitType_TBL");
                        j.IndexerProperty<string>("KitId")
                            .HasMaxLength(6)
                            .HasColumnName("KitID");
                        j.IndexerProperty<string>("KtypeId")
                            .HasMaxLength(6)
                            .HasColumnName("KTypeID");
                    });
        });

        modelBuilder.Entity<QuestionTbl>(entity =>
        {
            entity.HasKey(e => e.QuestionId).HasName("PK__Question__0DC06F8CDC0771A4");

            entity.ToTable("Question_TBL");

            entity.Property(e => e.QuestionId)
                .HasMaxLength(6)
                .HasColumnName("QuestionID");
            entity.Property(e => e.AccountId)
                .IsRequired()
                .HasMaxLength(6)
                .HasColumnName("AccountID");
            entity.Property(e => e.DateOfQuestion).HasColumnType("datetime");
            entity.Property(e => e.LabName)
                .IsRequired()
                .HasMaxLength(100);
            entity.Property(e => e.Status)
                .IsRequired()
                .HasMaxLength(20);

            entity.HasOne(d => d.Account).WithMany(p => p.QuestionTbls)
                .HasForeignKey(d => d.AccountId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Question___Accou__7B5B524B");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}