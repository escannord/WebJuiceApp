import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { LogType, ServiceRecord } from "../../models/juice.model";
import { JuiceService } from "../../core/services/juice.service";
import { LogService } from "../../core/services/log.service";

@Component({
  selector: "app-history",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./history.component.html",
  styleUrls: ["./history.component.scss"],
})
export class HistoryComponent implements OnInit {
  logRecords: LogType[] = [];
  filteredRecords: LogType[] = [];

  // Pagination variables
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;
  paginatedRecords: LogType[] = [];

  filterType: string = "all";
  dateFrom: string = "";
  dateTo: string = "";

  constructor(
    private juiceService: JuiceService,
    private logService: LogService
  ) {}

  ngOnInit(): void {
    this.loadLogs();
  }

  loadLogs(): void {
    this.logService.getLogs().subscribe((records) => {
      this.logRecords = records;
      this.filteredRecords = [...records];
      this.totalItems = this.filteredRecords.length;
      this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
      this.updatePaginatedRecords();
    });
  }

  applyFilters(): void {
    let filtered = [...this.logRecords];

    // Apply type filter
    if (this.filterType !== "all") {
      filtered = filtered.filter(
        (record) => record.juiceType === this.filterType
      );
    }

    // Apply date filters
    if (this.dateFrom) {
      const fromDate = new Date(this.dateFrom);
      filtered = filtered.filter(
        (record) => new Date(record.createdAt as any) >= fromDate
      );
    }

    if (this.dateTo) {
      const toDate = new Date(this.dateTo);
      toDate.setHours(23, 59, 59, 999); // Set to end of day
      filtered = filtered.filter(
        (record) => new Date(record.createdAt as any) <= toDate
      );
    }

    this.filteredRecords = filtered;
    this.totalItems = this.filteredRecords.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.currentPage = 1; // Reset to first page when filters change
    this.updatePaginatedRecords();
  }

  updatePaginatedRecords(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedRecords = this.filteredRecords.slice(startIndex, endIndex);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedRecords();
    }
  }

  changeItemsPerPage(): void {
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }
    this.updatePaginatedRecords();
  }

  getPageNumbers(): number[] {
    const pagesToShow = 5; // Number of page buttons to show
    let startPage: number, endPage: number;

    if (this.totalPages <= pagesToShow) {
      // Less than pagesToShow total pages so show all
      startPage = 1;
      endPage = this.totalPages;
    } else {
      // More than pagesToShow total pages so calculate start and end pages
      const halfPagesToShow = Math.floor(pagesToShow / 2);

      if (this.currentPage <= halfPagesToShow + 1) {
        startPage = 1;
        endPage = pagesToShow;
      } else if (this.currentPage + halfPagesToShow >= this.totalPages) {
        startPage = this.totalPages - pagesToShow + 1;
        endPage = this.totalPages;
      } else {
        startPage = this.currentPage - halfPagesToShow;
        endPage = this.currentPage + halfPagesToShow;
      }
    }

    return Array.from(
      { length: endPage + 1 - startPage },
      (_, i) => startPage + i
    );
  }

  get distinctJuiceTypes(): string[] {
    const types = this.logRecords.map(record => record?.juiceType);
    return [...new Set(types)];
  }

  getRecordClass(record: LogType): string {
    return `record-${record?.juiceType?.toLowerCase()}`;
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
}
